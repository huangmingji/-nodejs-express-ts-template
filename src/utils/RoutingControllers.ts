import { RequestHandler, Express, Router } from "express";
import path from "path";
import fs from "fs";

class MapValue {
    public baseUrl?: string;
    public routes?: Array<Route>;
    public middleware?: Array<RequestHandler>;
    public self?: any;
}

class Route {
    public name: string;
    public url: string;
    public method: "get" | "post" | "put" | "delete" | "patch";
    public handler?: RequestHandler;
    public middleware?: Array<RequestHandler>;

    constructor(name: string, url: string, method: "get" | "post" | "put" | "delete" | "patch", handler?: RequestHandler, middleware?: Array<RequestHandler>) {
        this.name = name;
        this.url = url;
        this.method = method;
        this.handler = handler;
        this.middleware = middleware;
    }
}

const map = new Map<object, MapValue>();

const setTargetToMap = (target: any) => {
    if (!map.has(target)) {
        map.set(target, {});
    }
};

const getTargetFromMap = (key: any) => {
    setTargetToMap(key);
    return map.get(key)!;
};

const addSelfToMap = (target: any, self: any) => {
    const data = getTargetFromMap(target);
    data.self = self;
};

const Controller = (baseUrl?: string) => {
    return (target: any) => {
        if (baseUrl) {
            const data = getTargetFromMap(target);
            // 收集前缀路径
            data.baseUrl = baseUrl;
        }
    };
};

// 创建路由数据
const createRoute = (target: any, name: string) => {
    const data = getTargetFromMap(target)!;
    if (!data.routes) {
        // 判空
        data.routes = [];
    }
    //   查询是否已经存在了对应的路由
    let route = data.routes.find((item) => item.name === name);
    if (!route) {
        // 没有则创建一个路由
        route = new Route(name , `/${name}`, "get");
        data.routes.push(route);
    }
    //   返回路由
    return route;
};

const createMethod = (method: "get" | "post" | "put" | "delete" | "patch") => {
    return (url?: string) => {
        return (target: any, name: string) => {
            // 路由请求路径，url不存在，则使用方法名作为请求路径
            const requestUrl = url ? url : `/${name}`;
            //   创建路由数据
            const route = createRoute(target.constructor, name);
            //   路由请求的url
            route.url = requestUrl;
            //   路由请求方法
            route.method = method;
            //   路由请求处理函数
            route.handler = target[name];
        };
    };
};

const Get = createMethod("get");

const Post = createMethod("post");

const Put = createMethod("put");

const Delete = createMethod("delete");

const Patch = createMethod("patch");

const Middleware = (...args: Array<RequestHandler>) => {
    return (target: any, name?: string) => {
        // name如果存在，则说明是装饰在类的方法上，否则就是装饰在类上
        const data = name
            ? createRoute(target.constructor, name)
            : getTargetFromMap(target);

        if (!data.middleware) {
            // 判空
            data.middleware = [];
        }
        args.forEach((item) => {
            // 去重
            const res = data.middleware?.find((i) => i === item);
            if (!res) {
                data.middleware?.push(item);
            }
        });
    };
};

const RoutingControllers = (app: Express) => {
    // 获取controllers存放的目录
    const dir = path.resolve(__dirname, "../controllers");
    //   获取目录下的所有文件名
    const files = fs.readdirSync(dir);
    // console.log(files)
    files.forEach((file) => {
        // 动态加载模块
        const module = require(path.join(dir, file));
        // console.log(path.join(dir, file));
        // 模块是通过esmodule的格式导出的，所以需要通过default获取
        const Constructor = module.default;
        // 初始化Controller
        const instance = new Constructor();
        // 将实例对象存储到数据结构中
        addSelfToMap(Constructor, instance);
    });
    //   注册路由
    register(app);
};

const register = (app: Express) => {
    // 遍历存储的数据结构
    map.forEach((item) => {
        // 初始化一个路由模块
        const router = Router();
        if (item.middleware?.length) {
            // 全局的路由模块中间件
            // 一定要放在最前面
            // 中间件在前面的先执行
            router.use(...item.middleware);
        }
        // 获取所有路由
        const routes = item.routes ?? [];
        // 遍历每一个路由
        routes.forEach((route) => {
            // 路由url
            const url = route.url;
            if (!route.method || !url || !route.handler) {
                // 判空
                return;
            }
            // 中间件合并去重
            const middleware = [
                ...(route.middleware ?? []),
                // 请求处理函数绑定Controller实例，以便请求处理函数可以访问Controller实例的其他方法和属性
                route.handler.bind(item.self),
            ];
            // 创建路由
            router[route.method](url, ...(middleware as any));
        });

        const baseUrl = item.baseUrl;
        if (baseUrl) {
            app.use(baseUrl, router);
        } else {
            app.use(router);
        }
    });
};

export { Get, Post, Put, Delete, Patch, Controller, Middleware, RoutingControllers };
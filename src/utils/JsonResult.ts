import { Response } from "express";

export const success = (response: Response, data: any) => {
    response.locals.data = data;
    response.status(200)
    response.set('Content-Type', 'application/json')
    response.send(JSON.stringify(data))
}

export const error = (response: Response, message: string, detail: any = null, data: any = null, name: string = '') => {
    var result = {
        code: 400,
        message: message,
        detail: detail,
        data: data,
        name: name
    };
    response.locals.error = error;
    response.status(400)
    response.set('Content-Type', 'application/json')
    response.send(JSON.stringify(result))
}

export const unauthorized = (response: Response, message: string, detail: any = null, data: any = null) => {
    var result = {
        code: 401,
        message: message,
        detail: detail,
        data: data,
        name: 'unauthorized'
    };
    response.locals.error = error;
    response.status(401)
    response.set('Content-Type', 'application/json')
    response.send(JSON.stringify(result))
}
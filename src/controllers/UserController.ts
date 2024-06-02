import { Request, Response } from 'express';
import User  from '../models/User';
import UserService from '../services/UserService';
import { success, error } from '../utils/json-result'
import { Get, Post, Put, Delete, Controller} from '../utils/routing-controllers'

@Controller('/api/user')
class UserController {

    constructor() { }

    @Post('/')
    public async create(req: Request, res: Response): Promise<any> {
        try {
            var user = new User(
                req.body.account, 
                req.body.password, 
                req.body.secret_key, 
                req.body.nick_name, 
                req.body.avatar == null || req.body.avatar == undefined ? '' : req.body.avatar, 
                req.body.email,
                req.body.phone_number, 
                req.body.creator_id == null || req.body.creator_id == undefined ? 0 : req.body.creator_id);
    
            if (user.account == null || user.account == '') {
                error(res, "用户名不能为空");
                return;
            }
            if (user.password == null || user.password == '') {
                error(res, "密码不能为空");
                return;
            }
            if (user.email == null || user.email == '') {
                error(res, "邮箱不能为空");
                return;
            }
            if (user.phone_number == null || user.phone_number == '') {
                error(res, "手机号不能为空");
                return;
            }
            var existingUser = await UserService.getByAccount(user.account);
            if (existingUser != null) {
                error(res, "用户已存在");
                return
            }
            existingUser = await UserService.getByEmail(user.email);
            if (existingUser != null) {
                error(res, "邮箱已存在");
                return;
            }
            existingUser = await UserService.getByPhoneNumber(user.phone_number);
            if (existingUser != null) {
                error(res, "手机号已存在");
                return;
            }
            UserService.create(user).then(result => {
                success(res, result);
            });
        } catch (err: any) {
            console.error(err);
            error(res, err.message);
        }
    }

    @Get('/')
    public get(req: Request, res: Response): any {
        res.send('users');
    }

    @Put('/')
    public update(req: Request, res: Response): any {
        res.send('update user');
        // 处理更新用户的请求
    }

    @Delete('/')
    public delete(req: Request, res: Response): void {
        res.send('delete user');
        // 处理删除用户的请求
    }
}

export default UserController;
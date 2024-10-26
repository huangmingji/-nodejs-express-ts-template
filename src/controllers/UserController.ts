import { Request, Response } from 'express';
import UserService from '../services/UserService';
import { success, error } from '../utils/JsonResult'
import { Get, Post, Put, Delete, Controller} from '../utils/RoutingControllers'
import CreateOrUpdateUserDto from '../models/CreateOrUpdateUserDto'

@Controller('/api/user')
class UserController {

    constructor() { }

    @Post('/')
    public async create(req: Request, res: Response): Promise<any> {
        try {
            var user = new CreateOrUpdateUserDto(
                req.body.account,
                req.body.avatar == null || req.body.avatar == undefined ? '' : req.body.avatar,
                req.body.email,
                req.body.nick_name,
                req.body.password, 
                req.body.phone_number,
                req.body.creator_id == null || req.body.creator_id == undefined ? 0 : req.body.creator_id,
                0);
    
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
            const result = await UserService.create(user);
            success(res, result);
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
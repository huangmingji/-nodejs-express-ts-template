import { Controller, Get, Middleware } from "../utils/routing-controllers";
import { Request, Response } from 'express';

@Controller('/')
class HomeController {

    constructor() { }

    @Get('/')
    public get(req: Request, res: Response): any {
        res.send('Hello, TypeScript Express!');
    }
}

export default HomeController;
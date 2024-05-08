import express, { Request, Response, Router } from 'express';
import usersRouter from './users';
function routers (router: express.Router) {
    router.get('/', (req: Request, res: Response) => {
        res.send('Hello, TypeScript Express!');
    });
    usersRouter(router);
    return router;
}

export default routers


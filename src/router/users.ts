import express, { Request, Response } from 'express';
import UserController from '../controllers/user';
function usersRouter (router: express.Router) {
    router.get('/users', (req: Request, res: Response) => { 
        res.send('users');
    });
    const controller = new UserController();
    router.post('/api/user', controller.create);
    return router;
}

export default usersRouter
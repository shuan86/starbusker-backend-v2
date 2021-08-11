import { Application as ExpressApplication, Request, Response, Router } from 'express';
import IRoute from './route.abstract';
import * as memberController from "../controllers/memberController";
import { authMember } from "../middlewares/auth";
export class MemberRoutes extends IRoute {
  // private memberController: MemberController = new MemberController();
  constructor() {
    super();
    this.setRoutes();
  }
  protected setRoutes() {
    this.router.get('/test', (req: Request, res: Response) => {
      res.status(200).send('you called user path test!')
    });
    this.router.route('/init')
      .get(memberController.init);
    this.router.route('/enroll')
      .post(memberController.enroll);
    this.router.route('/login')
      .post(memberController.login);
    this.router.route('/logout')
      .post(authMember, memberController.logout);
  }
}
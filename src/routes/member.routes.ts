import { Application as ExpressApplication, Request, Response, Router } from 'express';
import IRoute from './route.abstract';
import { apiPath } from '../config/router';
import * as memberController from "../controllers/memberController";
import { authMember } from "../middlewares/auth";
import { loginRsaDecrypt } from "../middlewares/rsaDecrypt";
import passport from "../moudles/passport";

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
    this.router.route(apiPath.enroll)
      .post(memberController.enroll);
    this.router.route(apiPath.login)
      .post(loginRsaDecrypt, memberController.login);
    this.router.route(apiPath.logout)
      .post(authMember, memberController.logout);
    this.router.route(apiPath.memberInfo)
      .get(authMember, memberController.getMemberInfo);
    this.router.route(apiPath.memberInfo)
      .put(authMember, memberController.updateMemberInfo);
  }
}
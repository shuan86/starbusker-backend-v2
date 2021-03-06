import { Application as ExpressApplication, Request, Response, Router } from 'express';
import IRoute from './route.abstract';
import { apiPath } from '../config/router';
import * as memberController from "../controllers/memberController";
import { authMember } from "../middlewares/auth";
import { loginRsaDecrypt } from "../middlewares/rsaDecrypt";
import { upload } from "../middlewares/auth";
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
    this.router.route(apiPath.line)
      .get(memberController.loginWithLine());
    this.router.route(apiPath.lineCallback)
      .get(memberController.lineCallback);

    this.router.route(apiPath.fb)
      .get(memberController.loginWithFB());
    this.router.route(apiPath.fbCallback)
      .get(memberController.fbCallback);
    this.router.route(apiPath.google)
      .get(memberController.loginWithGoogle());
    this.router.route(apiPath.googleCallback)
      .get(memberController.googleCallback);

    this.router.route(apiPath.logout)
      .post(authMember, memberController.logout);
    this.router.route(apiPath.memberInfo)
      .get(authMember, memberController.getMemberInfo);
    this.router.route(apiPath.memberInfo)
      .put(authMember, upload.single('avatar'), memberController.updateMemberInfo);
    this.router.route(apiPath.password)
      .put(authMember, memberController.updatePassword);
    this.router.route(apiPath.forgotPassword)
      .post(memberController.forgotPassword)
  }
}
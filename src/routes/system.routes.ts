import { Request, Response } from 'express';
import IRoute from './route.abstract';
import * as systemController from "../controllers/systemController";
import { apiPath } from "../config/router";

export class SystemRoutes extends IRoute {
  // private memberController: MemberController = new MemberController();
  constructor() {
    super();
    this.setRoutes();
  }
  protected setRoutes() {
    // this.router.get('/test', (req: Request, res: Response) => {
    //   res.status(200).send('you called user path test!')
    // });
    this.router.route('/init')
      .get(systemController.init);
    this.router.route('/testLineOrder')
      .get(systemController.lineOrder);
    this.router.route('/testLineReceipt')
      .get(systemController.lineReceipt);
  }
}
import { Application as ExpressApplication, Request, Response, Router } from 'express';
import IRoute from './route.abstract';
import * as buskerController from "../controllers/buskerController";
// import { BuskerController } from "../controllers/buskerController";

import { apiPath } from "../config/router";

export class BuskerRoutes extends IRoute {
  // private buskerController: BuskerController = new BuskerController();
  constructor() {
    super();
    this.setRoutes();
  }
  protected setRoutes() {
    // this.router.get('/test', (req: Request, res: Response) => {
    //   res.status(200).send('you called user path test!')
    // });
    this.router.route(apiPath.applyBusker)
      .post(buskerController.enroll);

  }
}
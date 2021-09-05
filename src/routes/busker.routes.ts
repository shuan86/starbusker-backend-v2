import IRoute from './route.abstract';
import * as buskerController from "../controllers/buskerController";
import { authMember } from "../middlewares/auth";
import { apiPath } from "../config/router";
import express from "express";
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
    this.router.route(apiPath.getBusker)
      .get(authMember, buskerController.getBusker);
    this.router.route(apiPath.enrollBusker)
      .post(authMember, buskerController.enroll);
    this.router.route(apiPath.performance)
      .post(authMember, buskerController.applyPerformance);
    this.router.route(apiPath.performances)
      .get(buskerController.getPerformances);
    this.router.route(apiPath.performancesTime)
      .get(buskerController.getAllPerformanceTime);
    this.router.route(apiPath.performance)
      .delete(buskerController.deletePerformance);
  }
}
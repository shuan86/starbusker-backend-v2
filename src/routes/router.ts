import MainRoute from "./route.abstract";
import { MemberRoutes } from "./member.routes";
import { BuskerRoutes } from "./busker.routes";
import { SystemRoutes } from "./system.routes";

export const router: Array<MainRoute> = [
  new MemberRoutes(),
  new SystemRoutes(),
  new BuskerRoutes()
];

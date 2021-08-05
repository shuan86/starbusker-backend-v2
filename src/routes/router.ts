import MainRoute from "./route.abstract";
import { MemberRoutes } from "./member.routes";
const router: Array<MainRoute> = [
  new MemberRoutes(),
];

export default router;
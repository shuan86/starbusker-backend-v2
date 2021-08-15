import { ConnectionOptions } from "typeorm";
import { envSetup } from "../envSetup";
import * as dotenv from 'dotenv'
dotenv.config({ path: envSetup() })
// const env = envSetup()
// const config: ConnectionOptions = {
//   type: "mysql",
//   host: process.env.MYSQL_HOST,
//   port: 3306,
//   username: process.env.MYSQL_USERNAME,
//   password: process.env.MYSQL_PASSWORD,
//   database: process.env.MYSQL_DB,
//   entities: [
//     __dirname + "/../entities/*.js"
//   ],
//   synchronize: true,
//   logging: false,
//   dropSchema: false
// }
const config: ConnectionOptions = {
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: 3306,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [
    __dirname + "/../entities/*{.ts,.js}"
  ],
  synchronize: true,
  logging: false,
  dropSchema: true
}

export default config;
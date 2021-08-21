import 'reflect-metadata';
import express from "express";
import { router } from "./routes/router";
import { createConnection, getConnection } from 'typeorm';
import config from './config/ormconfig';
import cors from 'cors'
import { envSetup } from "./envSetup";
import * as dotenv from 'dotenv'
import session from "express-session";
dotenv.config({ path: envSetup() })
const corsOptions = {
  origin: [
    'http://www.example.com',
    'http://localhost:3000',

  ],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
};
export const sessionMiddleware=session({
  secret: 'mySecret',
  name: 'member', // optional
  saveUninitialized: false,
  resave: true,
})
declare module 'express-session' {
  interface SessionData {
      member: number;
  }
}


export class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
    this.routerSetup();
    if (process.env.mode == 'prod' || process.env.mode == 'dev') {
      this.dbSetup();
    }
    else if (process.env.mode == 'test') {

    }
  }
  private config(): void {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(cors(corsOptions));
    this.app.use(sessionMiddleware)
    
  }
  private routerSetup() {
    for (const route of router) {
      this.app.use(route.getPrefix(), route.getRouter());
    }
  }

  public async dbSetup() {
    try {
      const connection = await createConnection(config)
      console.log("Has connected to DB? ", connection.isConnected);
    } catch (error) {
      console.log("TypeORM connection error: ", error)
    }
  }

}

export const app = new App().app
// app.setup()


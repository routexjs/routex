import * as http from "http";
import * as https from "https";
import { Routex } from ".";

export interface IAppMiddleware {
  initializeServer?: (
    server: http.Server | https.Server
  ) => http.Server | https.Server | void;
}

export type AppMiddleware = (routex: Routex) => IAppMiddleware;

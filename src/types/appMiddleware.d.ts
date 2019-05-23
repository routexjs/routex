import * as http from "http";
import { Routex } from "..";

export interface IAppMiddleware {
  initializeServer?: (server: http.Server) => http.Server | void;
}

export type AppMiddleware = (routex: Routex) => IAppMiddleware;

import { ErrorWithStatusCode, Router } from ".";
import { ICtx } from "./ctx";

export type Handler = (ctx: ICtx) => Promise<void> | void;

export type Middleware = (ctx: ICtx) => (() => void) | Promise<void> | void;

export type ErrorHandler =
  | Handler
  | ((ctx: ICtx, error: Error | ErrorWithStatusCode) => Promise<any> | any);

type RouteHandler_ = Router | Handler;

export type RouteHandler = RouteHandler_ | RouteHandler_[];

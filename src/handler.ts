import { ErrorWithStatusCode, IBody, Router } from ".";
import { ICtx } from "./ctx";

type PromiseOr<T> = Promise<T> | T;

export type Handler = (ctx: ICtx) => PromiseOr<void> | PromiseOr<IBody>;

export type Middleware = (
  ctx: ICtx
) => (() => void) | PromiseOr<void> | PromiseOr<any>;

export type ErrorHandler =
  | Handler
  | ((ctx: ICtx, error: Error | ErrorWithStatusCode) => PromiseOr<any>);

type RouteHandler_ = Router | Handler;

export type RouteHandler = RouteHandler_ | RouteHandler_[];

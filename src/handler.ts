import { ErrorWithStatusCode, IBody, Router } from ".";
import { ICtx } from "./ctx";

type PromiseOr<T> = Promise<T> | T;

export type Handler = (ctx: ICtx) => PromiseOr<void | IBody>;

export type Middleware =
  | Handler
  | ((ctx: ICtx) => (() => PromiseOr<void>) | PromiseOr<void>);

export type ErrorHandler =
  | Handler
  | ((ctx: ICtx, error: Error | ErrorWithStatusCode) => PromiseOr<void>);

type RouteHandler_ = Router | Handler;

export type RouteHandler = RouteHandler_ | RouteHandler_[];

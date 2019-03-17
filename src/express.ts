import { Handler } from "./router";

type ExpressMiddleware = (req: any, res: any, next?: () => void) => any;

export function useExpress(handler: ExpressMiddleware): Handler {
  return async ctx => {
    if (handler.length >= 3) {
      return new Promise<void>(resolve => {
        handler(ctx.req, ctx.res, resolve);
      });
    } else {
      return handler(ctx.req, ctx.res);
    }
  };
}

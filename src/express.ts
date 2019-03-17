import { Handler } from "./router";

// TODO: Use proper Connect typings
// tslint:disable-next-line:ban-types
export function useExpress(handler: Function): Handler {
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

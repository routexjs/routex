// TODO: Use proper Connect typings
import { Handler } from "./handler";

export function useExpress(handler: any): Handler {
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

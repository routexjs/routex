import { Handler, Request, Response } from "./router";

export function isString(value: any): boolean {
  return typeof value === "string" || value instanceof String;
}

interface ICtx {
  req: Request;
  res: Response;
  body?: any;
}

export type CtxHandler = (ctx: ICtx) => Promise<any> | any;

export function useCtx(handler: CtxHandler): Handler {
  return async (req, res) => {
    const ctx: ICtx = {
      req,
      res
    };

    const result = await handler(ctx);

    if (ctx.body) {
      ctx.res.json(ctx.body);
    }

    return result;
  };
}

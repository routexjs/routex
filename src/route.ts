import * as pathToRegexp from "path-to-regexp";

import { Handler, ICtx, Methods, RouteHandler, Router } from "./router";

export interface IRouteOptions {
  exact?: boolean;
}

export class Route {
  public method: Methods | Methods[] | undefined;
  public path: string | undefined;
  public regex: RegExp | undefined;
  public handler: RouteHandler;
  public keys: pathToRegexp.Key[] = [];

  constructor(
    method: Methods | Methods[] | undefined,
    path: string | undefined,
    handler: RouteHandler,
    { exact = false }: IRouteOptions = {}
  ) {
    this.method = method;
    this.path = path;
    if (path) {
      this.regex = pathToRegexp(path, this.keys, { end: exact });
    }

    this.handler = handler;
  }

  public handle: Handler = async (ctx): Promise<any> => {
    return this.handleHandler(this.handler, ctx);
  };

  private handleHandler = async (
    handler: RouteHandler,
    ctx: ICtx
  ): Promise<any> => {
    if (handler instanceof Router) {
      return handler.handle(ctx);
    } else if (Array.isArray(handler)) {
      for (let index = 0; index < handler.length; index++) {
        const childHandler = handler[index];
        const returned: any = await this.handleHandler(childHandler, ctx);

        if (index === handler.length - 1) {
          return returned;
        }
      }
    } else {
      return handler(ctx);
    }
  };
}

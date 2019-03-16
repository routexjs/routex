import * as pathToRegexp from "path-to-regexp";
import Router, {
  Handler,
  Methods,
  Request,
  Response,
  RouteHandler
} from "./router";

export interface IRouteOptions {
  exact?: boolean;
}

export class Route {
  public method: Methods | Methods[] | undefined;
  public path: string | undefined;
  public regex: RegExp | undefined;
  public handler: RouteHandler;

  constructor(
    method: Methods | Methods[] | undefined,
    path: string | undefined,
    handler: RouteHandler,
    { exact = false }: IRouteOptions = {}
  ) {
    this.method = method;
    this.path = path;
    if (path) {
      this.regex = pathToRegexp(path, undefined, { end: exact });
    }

    this.handler = handler;
  }

  public handle: Handler = async (req, res): Promise<any> => {
    return this.handleHandler(this.handler, req, res);
  };

  private handleHandler = async (
    handler: RouteHandler,
    req: Request,
    res: Response
  ): Promise<any> => {
    if (handler instanceof Router) {
      return handler.handle(req, res);
    } else if (Array.isArray(handler)) {
      for (let index = 0; index < handler.length; index++) {
        const childHandler = handler[index];
        const returned: any = await this.handleHandler(childHandler, req, res);

        if (index === handler.length - 1) {
          return returned;
        }
      }
    } else {
      return handler(req, res);
    }
  };
}

import { IncomingMessage, ServerResponse } from "http";
import * as pathToRegexp from "path-to-regexp";
import { ErrorWithStatusCode } from "./error";
import { Route } from "./route";

export enum Method {
  GET = "get",
  POST = "post"
}

export type Handler = (
  req: Request,
  res: Response
) => Promise<any> | any | undefined | null;

export interface IJsonOptions {
  pretty?: boolean | string;
}

export type Request = IncomingMessage & {
  matches: RegExpExecArray[];
  _path: string;
};

export type Response = ServerResponse & {
  json: (json: any, options?: IJsonOptions) => any;
};

export type ErrorHandler =
  | Handler
  | ((
      req: Request,
      res: Response,
      error: Error | ErrorWithStatusCode
    ) => Promise<any> | any);

type RouteHandler_ = Router | Handler;
export type RouteHandler = RouteHandler_ | RouteHandler_[];

type RouteAdder = (path: string, handler: RouteHandler) => Router;

export default class Router {
  public routes: Route[] = [];
  public errorHandler: ErrorHandler | undefined;

  // Methods, added dynamically
  public get!: RouteAdder;
  public post!: RouteAdder;

  public use = (path: string, handler: RouteHandler) => {
    this.routes.push(new Route(undefined, path, handler));
  };

  public handle: Handler = async (req, res) => {
    try {
      if (!req.method || !req.url) {
        /* istanbul ignore next */
        // Invalid HTTP request, should never happen
        throw new ErrorWithStatusCode(400, "Invalid request");
      }

      if (!req._path) {
        req._path = req.url;
      }

      const method: string = req.method.toLowerCase();
      const url: string = req._path;

      let route: Route | undefined;
      let match: RegExpExecArray | null;

      this.routes.some(testRoute => {
        if (testRoute.method && testRoute.method !== method) {
          return false;
        }

        if (testRoute.regex) {
          match = testRoute.regex.exec(url);
          if (!match) {
            return false;
          }
        }

        if (match) {
          req._path = req._path.replace(match[0], "");
        }
        route = testRoute;
        return true;
      });

      if (route) {
        return await route.handle(req, res);
      }

      // 404
      throw new ErrorWithStatusCode(404, "Not Found");
    } catch (error) {
      if (this.errorHandler) {
        return this.errorHandler(req, res, error);
      }

      throw error;
    }
  };
}

// Attach method shortcuts such as router.get(...), etc
Object.values(Method).forEach(method => {
  // @ts-ignore
  Router.prototype[method] = function(path: string, handler: RouteHandler) {
    this.routes.push(new Route(method, path, handler));

    return this;
  };
});

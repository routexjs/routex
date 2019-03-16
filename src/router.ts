import { IncomingMessage, ServerResponse } from "http";
import { ErrorWithStatusCode } from "./error";
import { IRouteOptions, Route } from "./route";
import { toLowerCases } from "./utils";

export enum Methods {
  GET = "get",
  POST = "post",
  DELETE = "delete",
  PUT = "put",
  PATCH = "patch"
}

export type Handler = (
  req: Request,
  res: Response
) => Promise<any> | any | undefined | null;

export type Middleware = (
  req: Request,
  res: Response
) => (() => void) | Promise<void> | void;

export interface IJsonOptions {
  pretty?: boolean | string;
}

export type Request = IncomingMessage & {
  matches: RegExpExecArray[];
  _path: string;
  data: any;
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

type RouteAdder = (
  path: string,
  handler: RouteHandler,
  options?: IRouteOptions
) => Router;

export default class Router {
  public errorHandler: ErrorHandler | undefined;

  // Methods, added dynamically
  public get!: RouteAdder;
  public post!: RouteAdder;
  public delete!: RouteAdder;
  public put!: RouteAdder;
  public patch!: RouteAdder;

  private routes: Route[] = [];
  private middlewares: Middleware[] = [];

  public child = (path: string, handler?: Router, options?: IRouteOptions) => {
    const router = handler || new Router();

    this.routes.push(new Route(undefined, path, router, options));

    return router;
  };

  public route = (
    method: Methods | Methods[] | undefined,
    path: string,
    handler: RouteHandler,
    options?: IRouteOptions
  ) => {
    this.routes.push(
      new Route(
        toLowerCases(method) as Methods | Methods[] | undefined,
        path,
        handler,
        { exact: true, ...options }
      )
    );
    return this;
  };

  public any = (
    path: string,
    handler: RouteHandler,
    options?: IRouteOptions
  ) => {
    return this.route(undefined, path, handler, options);
  };

  public middleware = (middleware: Middleware) => {
    if (middleware) {
      this.middlewares.push(middleware);
    }

    return this;
  };

  public handle: Handler = async (req, res) => {
    try {
      const middlewaresNext: Array<() => void | Promise<void>> = [];

      for (const middleware of this.middlewares) {
        const next = await middleware(req, res);

        if (next) {
          middlewaresNext.push(next);
        }
      }

      if (!req.method || !req.url) {
        /* istanbul ignore next */
        // Invalid HTTP request, should never happen
        throw new ErrorWithStatusCode(400, "Invalid request");
      }

      if (req._path == null) {
        req._path = req.url;
      }
      if (!req._path) {
        req._path = "/";
      }

      const method = req.method.toLowerCase() as Methods;
      const url: string = req._path;

      let route: Route | undefined;
      let match: RegExpExecArray | null;

      this.routes.some(testRoute => {
        const matchesMethod =
          testRoute.method &&
          testRoute.method !== method &&
          !(
            Array.isArray(testRoute.method) && testRoute.method.includes(method)
          );

        if (matchesMethod) {
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
        await route.handle(req, res);

        for (const middelwareNext of middlewaresNext) {
          await middelwareNext();
        }
        return;
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
Object.values(Methods).forEach(method => {
  // @ts-ignore
  Router.prototype[method] = function(
    path: string,
    handler: RouteHandler,
    options?: IRouteOptions
  ) {
    return this.route(method, path, handler, options);
  };
});

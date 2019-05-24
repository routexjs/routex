import * as http from "http";
import * as https from "https";
import * as parseUrl from "parseurl";
import * as qs from "qs";
import * as throng from "throng";
import * as uuid from "uuid";

import { JsonBody } from "./body/json";
import { TextBody } from "./body/text";
import { ErrorWithBody } from "./errors/body";
import { defaultErrorHandler } from "./errors/defaultHandler";
import { ErrorWithStatusCode } from "./errors/status";
import { useExpress } from "./express";
import { Methods } from "./methods";
import { Router } from "./router";
import { AppMiddleware, IAppMiddleware } from "./types/appMiddleware";
import { ICtx } from "./types/ctx";
import { ErrorHandler, Handler, Middleware } from "./types/handler";
import { isString, toArray } from "./utils";

export {
  Router,
  ErrorWithStatusCode,
  ErrorWithBody,
  useExpress,
  JsonBody,
  TextBody,
  Methods,
  Handler,
  Middleware,
  IAppMiddleware,
  AppMiddleware,
  ICtx,
  defaultErrorHandler,
  ErrorHandler
};

export interface IListenOptions {
  hostname?: string;
  server?: http.Server;
  https?: https.ServerOptions;
  cluster?: boolean | number;
}

export interface IClusterOptions extends IListenOptions {
  workers?: number | string;
}

export interface IRoutexOptions {
  requestId?: (() => string) | false;
}

export class Routex extends Router {
  public requestIdGenerator?: () => string;
  public errorHandler = defaultErrorHandler;
  private appMiddlewares: IAppMiddleware[] = [];
  private workerId?: number;

  constructor({ requestId }: IRoutexOptions = {}) {
    super();
    if (requestId !== false) {
      this.requestIdGenerator = requestId || (() => uuid());
    }
  }

  /**
   * Adds app middleware(s)
   */
  public appMiddleware = (appMiddleware: AppMiddleware | AppMiddleware[]) => {
    if (appMiddleware) {
      this.appMiddlewares.push(
        ...toArray(appMiddleware).map(appMiddlewareOne =>
          appMiddlewareOne(this)
        )
      );
    }

    return this;
  };

  /**
   * Handles HTTP request
   */
  public handler = async (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => {
    // Parse query string and extract path
    const parsed = parseUrl(req);
    const query =
      parsed &&
      (isString(parsed.query)
        ? qs.parse(parsed.query as string)
        : parsed.query);

    /* istanbul ignore next */
    const ctx: ICtx = {
      data: {},
      params: {},
      path: (parsed && parsed.pathname) || "/",
      query: query || {},
      req,
      requestId: this.requestIdGenerator
        ? this.requestIdGenerator()
        : undefined,
      res,
      workerId: this.workerId
    };

    await this.handle(ctx);

    if (ctx.body) {
      ctx.res.setHeader("Content-Length", ctx.body.contentLength);
      ctx.res.setHeader("Content-Type", ctx.body.contentType);
    }

    if (ctx.statusCode) {
      ctx.res.writeHead(ctx.statusCode);
    }

    if (ctx.body) {
      ctx.body.write(ctx.res);
    }

    ctx.res.end();

    return ctx;
  };

  /**
   * Starts the server
   */
  public async listen(
    port?: number | string,
    {
      hostname,
      server: optionsServer,
      https: httpsOptions
    }: IListenOptions = {}
  ) {
    if (port) {
      const originalPort = port;

      if (isString(port)) {
        port = parseInt(port as string, 10);
      }

      if (!Number.isInteger(port as number)) {
        throw new TypeError(
          `Invalid port (${originalPort} is not integer/string).`
        );
      }
    }

    if (hostname && !isString(hostname)) {
      throw new TypeError(`Invalid hostname (${hostname} is not a string)`);
    }

    const server = this.initializeServer(
      optionsServer ||
        (httpsOptions
          ? https.createServer(httpsOptions, this.handler)
          : http.createServer(this.handler))
    );

    await new Promise(resolve => {
      server.listen({ port: port as number, host: hostname }, resolve);
    });

    const close = () =>
      new Promise((resolve, reject) => {
        server.close(error => {
          if (error) {
            /* istanbul ignore next */
            reject(error);
          }
          resolve();
        });
      });

    const address = server.address();

    return {
      close,
      port:
        /* istanbul ignore next */
        address && !isString(address) ? address.port : null,
      server
    };
  }

  /* istanbul ignore next */
  public cluster(
    port?: number | string,
    { workers, ...options }: IClusterOptions = {}
  ) {
    throng({
      start: id => {
        this.workerId = id;
        this.listen(port, options);
      },
      workers
    });
  }

  /**
   * Decorates a server using app middlewares
   */
  public initializeServer(server: http.Server | https.Server) {
    return this.appMiddlewares.reduce(
      (reducingServer, appMiddleware) =>
        (appMiddleware.initializeServer &&
          appMiddleware.initializeServer(reducingServer)) ||
        reducingServer,
      server
    );
  }
}

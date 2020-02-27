import * as http from "http";
import * as https from "https";
import * as parseUrl from "parseurl";
import * as qs from "qs";
import * as throng from "throng";
import { v4 as uuid } from "uuid";

import { AppMiddleware, IAppMiddleware } from "./appMiddleware";
import { ICtx, ICtxProviders } from "./ctx";
import { defaultErrorHandler } from "./errors/defaultHandler";
import { ErrorHandler } from "./handler";
import { Methods } from "./methods";
import { Router } from "./router";
import { isString, toArray } from "./utils";

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
  errorHandler?: ErrorHandler;
  providers?: ICtxProviders;
}

export class Routex extends Router {
  public requestIdGenerator?: () => string;
  public errorHandler = defaultErrorHandler;
  private appMiddlewares: IAppMiddleware[] = [];
  private workerId?: number;
  public providers: ICtxProviders;

  public constructor({
    requestId,
    errorHandler,
    providers
  }: IRoutexOptions = {}) {
    super();
    if (requestId !== false) {
      this.requestIdGenerator = requestId || (() => uuid());
    }

    if (errorHandler) {
      this.errorHandler = errorHandler;
    }

    this.providers = providers || {};
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

  public createCtx = (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): ICtx => {
    // Parse query string and extract path
    const parsed = parseUrl(req);
    const query =
      parsed &&
      (isString(parsed.query)
        ? qs.parse(parsed.query as string)
        : parsed.query);

    /* istanbul ignore next */
    // Default to GET for missing methods (should never happen)
    const method = (req.method || Methods.GET).toLowerCase() as Methods;

    /* istanbul ignore next */
    return {
      data: {},
      params: {},
      method,
      path: (parsed && parsed.pathname) || "/",
      query: query || {},
      req,
      requestId: this.requestIdGenerator
        ? this.requestIdGenerator()
        : undefined,
      res,
      workerId: this.workerId,
      providers: { ...this.providers }
    };
  };

  /**
   * Handles HTTP request
   */
  public handler = async (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => {
    const ctx = this.createCtx(req, res);

    await this.handle(ctx);

    const chunk = ctx.body ? ctx.body.toBuffer() : undefined;

    if (ctx.body) {
      if (ctx.body.contentType) {
        ctx.res.setHeader("Content-Type", ctx.body.contentType);
      }

      if (chunk && (!ctx.statusCode || ![204, 304].includes(ctx.statusCode))) {
        ctx.res.setHeader("Content-Length", chunk.length);
      }
    }

    if (ctx.statusCode) {
      ctx.res.writeHead(ctx.statusCode);
    }

    if (ctx.body && ctx.method !== Methods.HEAD) {
      ctx.res.end(chunk);
    } else {
      ctx.res.end();
    }

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
          /* istanbul ignore next */
          if (error) {
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

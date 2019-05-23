import * as http from "http";
import { AddressInfo } from "net";
import * as parseUrl from "parseurl";
import * as qs from "qs";

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
}

export class Routex extends Router {
  public errorHandler = defaultErrorHandler;
  private appMiddlewares: IAppMiddleware[] = [];

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
      res
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
   * Starts HTTP server
   */
  public async listen(
    port?: number | string,
    { hostname, server: optionsServer }: IListenOptions = {}
  ) {
    if (port) {
      const originalPort = port;

      if (isString(port)) {
        port = parseInt(port as string, 10);
      }

      if (!Number.isInteger(port as number)) {
        throw new Error(`Invalid port (${originalPort} is not integer).`);
      }
    }

    if (hostname && !isString(hostname)) {
      throw new Error(`Invalid hostname (${hostname} is not a string)`);
    }

    const server = this.initializeServer(
      optionsServer || http.createServer(this.handler)
    );

    await new Promise(resolve => {
      server.listen(port as number, hostname, resolve);
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
        address && !isString(address) ? (address as AddressInfo).port : null,
      server
    };
  }

  /**
   * Decorates a server using app middlewares
   */
  public initializeServer(server: http.Server) {
    return this.appMiddlewares.reduce(
      (reducingServer, appMiddleware) =>
        (appMiddleware.initializeServer &&
          appMiddleware.initializeServer(reducingServer)) ||
        reducingServer,
      server
    );
  }
}

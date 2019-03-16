import * as http from "http";
import { AddressInfo } from "net";

import { ErrorWithStatusCode } from "./error";
import { useExpressNext } from "./express";
import Router, {
  ErrorHandler,
  Handler,
  IJsonOptions,
  Request,
  Response
} from "./router";
import { isString, useCtx } from "./utils";

export { Router, useCtx, ErrorWithStatusCode, useExpressNext };

export interface IListenOptions {
  hostname?: string;
}

const defaultErrorHandler: ErrorHandler = (req, res, error) => {
  res.writeHead(error instanceof ErrorWithStatusCode ? error.statusCode : 500);

  res.write(error.message);
  res.end();

  // tslint:disable-next-line:no-console
  console.error(error);
};

export class Routar extends Router {
  public errorHandler = defaultErrorHandler;

  public handler = async (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => {
    const handle: Handler = async (request, response) => {
      request.data = {};

      response.json = (json, { pretty = false }: IJsonOptions = {}) => {
        const space = pretty ? (pretty === true ? "  " : pretty) : undefined;

        const body = JSON.stringify(json, null, space);

        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Length", body.length);

        res.write(body);
      };

      await this.handle(request, response);

      response.end();
    };

    // TODO: Instead of casting like this, use a proper class
    await handle(req as Request, res as Response);
  };

  public async listen(
    port?: number | string,
    { hostname }: IListenOptions = {}
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

    const server = http.createServer(this.handler);

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

    return {
      close,
      port: (server.address() as AddressInfo).port as number,
      server
    };
  }
}

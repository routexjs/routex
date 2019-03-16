import * as http from "http";

import { ErrorWithStatusCode } from "./error";
import Router, {
  ErrorHandler,
  Handler,
  IJsonOptions,
  Request,
  Response
} from "./router";
import { isString, useCtx } from "./utils";

export { Router, useCtx, ErrorWithStatusCode };

export interface IListenOptions {
  hostname?: string;
}

const defaultErrorHandler: ErrorHandler = (req, res, error) => {
  res.writeHead(error instanceof ErrorWithStatusCode ? error.statusCode : 500);

  res.write(error.message);
  res.end();
};

export class Routar extends Router {
  public errorHandler = defaultErrorHandler;

  public rootHandler = async (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ) => {
    const handle: Handler = async (request, response) => {
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

    // Instead of casting like this, use a proper class
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

    const server = http.createServer(this.rootHandler);

    await new Promise(resolve => {
      server.listen(port as number, hostname, resolve);
    });

    return server;
  }
}

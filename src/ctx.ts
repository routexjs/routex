import * as http from "http";
import { IncomingMessage, ServerResponse } from "http";
import { IBody } from "./body";
import { Methods } from "./methods";

export interface ICtxRequest extends IncomingMessage {
  // Used for @routex/body-parser. Easier to set here to avoid conflicts
  body: any;
}

export interface ICtx {
  params: { [key: string]: string };
  readonly req: ICtxRequest;
  readonly res: ServerResponse;
  matches?: RegExpExecArray[];
  path: string;
  data: ICtxData;
  method: Methods;
  providers: ICtxProviders;
  body?: IBody;
  readonly query: any;
  statusCode?: number;
  readonly workerId?: number;
  readonly requestId?: string;
  error?: Error;
}

export interface ICtxData {
  [key: string]: any;
}

export interface ICtxProviders {
  [key: string]: any;
}

export interface ICreateCtx {
  path?: string;
  query?: any;
  requestId?: string;
  workerId?: number;
  method?: string;
  providers?: ICtxProviders;
  // Sometimes cannot be mocked during testing.
  // You can pass `{}` which should work in most cases, as internal code doesn't
  // use res & req after the initial context creation.
  //
  // And for proper type checking:
  //   req: {} as ICtxRequest,
  //   res: {} as http.ServerResponse,
  res: http.ServerResponse;
  req: ICtxRequest;
}

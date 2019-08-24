import { IncomingMessage, ServerResponse } from "http";
import { IBody } from "./body";
import { Methods } from "./methods";

export interface ICtx {
  params: { [key: string]: string };
  readonly req: IncomingMessage;
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
}

export interface ICtxData {
  [key: string]: any;
}

export interface ICtxProviders {
  [key: string]: any;
}

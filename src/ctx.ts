import { IncomingMessage, ServerResponse } from "http";
import { IBody } from "./body";

export interface ICtx {
  params: { [key: string]: string };
  readonly req: IncomingMessage;
  readonly res: ServerResponse;
  matches?: RegExpExecArray[];
  path: string;
  data: any;
  body?: IBody;
  readonly query: any;
  statusCode?: number;
  readonly workerId?: number;
  readonly requestId?: string;
}

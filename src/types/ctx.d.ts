import { IncomingMessage, ServerResponse } from "http";
import { IBody } from "../body";

export interface ICtx {
  params: { [key: string]: string };
  req: IncomingMessage;
  res: ServerResponse;
  matches?: RegExpExecArray[];
  path: string;
  data: any;
  body?: IBody;
  query: any;
  statusCode?: number;
}

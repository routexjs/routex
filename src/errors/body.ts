import { IBody } from "../body";
import { ErrorWithStatusCode } from "./status";

export class ErrorWithBody extends ErrorWithStatusCode {
  public body?: IBody;
  constructor(statusCode: number, body?: IBody) {
    super(statusCode, body ? body.toString() : undefined);
    this.body = body;
  }
}

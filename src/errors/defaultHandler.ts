import { ErrorHandler, TextBody } from "..";
import { ErrorWithBody } from "./body";
import { ErrorWithStatusCode } from "./status";

export const defaultErrorHandler: ErrorHandler = (ctx, error) => {
  ctx.statusCode =
    error instanceof ErrorWithStatusCode ? error.statusCode : 500;

  ctx.body =
    error instanceof ErrorWithBody ? error.body : new TextBody(error.message);
};

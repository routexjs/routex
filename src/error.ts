export class ErrorWithStatusCode extends Error {
  public statusCode: number;

  constructor(statusCode: number, message?: string) {
    super(message);
    this.statusCode = statusCode;

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

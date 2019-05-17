import { ServerResponse } from "http";

import { IBody } from ".";

export class TextBody implements IBody {
  public readonly contentType = "text/plain";

  public readonly contentLength: number;
  public readonly body: string;

  constructor(body: string) {
    this.body = body;
    this.contentLength = this.body.length;
  }

  public write = (response: ServerResponse) => {
    response.write(this.body);
  };

  public toString = () => this.body;
}

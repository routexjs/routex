import { ServerResponse } from "http";

import { IBody } from ".";

export class TextBody implements IBody {
  public readonly contentType: string;

  public readonly contentLength: number;
  public readonly body: string;

  public constructor(body: string, contentType: string = "text/plain") {
    this.body = body;
    this.contentLength = this.body.length;
    this.contentType = contentType;
  }

  public write = (response: ServerResponse) => {
    response.write(this.body);
  };

  public toString = () => this.body;
}

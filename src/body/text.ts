import { IBody } from ".";

export class TextBody implements IBody {
  public readonly contentType: string;

  public readonly contentLength: number;
  public readonly body: string;

  public constructor(body: string, contentType = "text/plain") {
    this.body = body;
    this.contentLength = this.body.length;
    this.contentType = contentType;
  }

  public toString = () => this.body;
  public toChunk = () => this.body;
}

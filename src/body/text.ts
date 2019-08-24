import { IBody } from ".";

export class TextBody implements IBody {
  public readonly contentType: string;

  public readonly body: string;

  public constructor(body: string, contentType = "text/plain") {
    this.body = body;
    this.contentType = contentType;
  }

  public toString = () => this.body;
  public toBuffer = () => Buffer.from(this.body, "utf8");
}

import { IBody } from ".";

interface IJsonBodyOptions {
  pretty?: string | boolean;
  contentType?: string;
}

export class JsonBody implements IBody {
  public readonly contentType: string;

  public readonly body: any;
  private readonly stringBody: string;

  public constructor(
    body: any,
    { pretty = false, contentType = "application/json" }: IJsonBodyOptions = {}
  ) {
    this.body = body;

    const space = pretty ? (pretty === true ? "  " : pretty) : undefined;
    this.stringBody = JSON.stringify(this.body, null, space);

    this.contentType = contentType;
  }

  public toString = () => this.stringBody;
  public toBuffer = () => Buffer.from(this.stringBody, "utf8");
}

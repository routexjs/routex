import { IBody } from ".";

interface IJsonBodyOptions {
  pretty?: string | boolean;
  contentType?: string;
}

export class JsonBody implements IBody {
  public readonly contentType: string;

  public readonly contentLength: number;
  public readonly body: string;

  public constructor(
    body: any,
    { pretty = false, contentType = "application/json" }: IJsonBodyOptions = {}
  ) {
    const space = pretty ? (pretty === true ? "  " : pretty) : undefined;

    this.body = JSON.stringify(body, null, space);

    this.contentLength = this.body.length;
    this.contentType = contentType;
  }

  public toString = () => this.body;
  public toChunk = () => this.body;
}

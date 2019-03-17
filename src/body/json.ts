import { ServerResponse } from "http";

import { IBody } from ".";

interface IJsonBodyOptions {
  pretty?: string | boolean;
}

export class JsonBody implements IBody {
  public readonly contentType = "application/json";

  public readonly contentLength: number;
  public readonly body: string;

  constructor(body: any, { pretty = false }: IJsonBodyOptions = {}) {
    const space = pretty ? (pretty === true ? "  " : pretty) : undefined;

    this.body = JSON.stringify(body, null, space);
    this.contentLength = this.body.length;
  }

  public write = (response: ServerResponse) => {
    response.write(this.body);
  };
}

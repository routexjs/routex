import { ServerResponse } from "http";

export interface IBody {
  readonly contentLength: number;
  readonly contentType: string;

  readonly write: (response: ServerResponse) => void;
  readonly toString: () => string;
}

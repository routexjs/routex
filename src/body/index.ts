export interface IBody {
  readonly contentLength: number;
  readonly contentType: string;
  readonly toString: () => string;
  readonly toChunk: () => any;
}

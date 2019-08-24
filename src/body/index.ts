export interface IBody {
  readonly contentType: string;
  readonly toString: () => string;
  readonly toBuffer: () => Buffer | undefined;
}

import { Handler } from "./router";

type ExpressMiddleware = (req: any, res: any, next: () => void) => any;

export function useExpressNext(handler: ExpressMiddleware): Handler {
  return async (req, res) => {
    return new Promise(resolve => {
      handler(req, res, resolve);
    });
  };
}

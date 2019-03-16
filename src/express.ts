import { Handler } from "./router";

export function useExpressNext(handler: any): Handler {
  return async (req, res) => {
    return new Promise(resolve => {
      handler(req, res, resolve);
    });
  };
}

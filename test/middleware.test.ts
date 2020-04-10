import * as request from "supertest";
import { Routex, useExpress, ICtx, JsonBody, TextBody } from "../src";

describe("Middlewares", () => {
  it("Handles middleware", () => {
    const app = new Routex();

    app
      .middleware((ctx) => {
        ctx.res.write("A");

        return () => {
          ctx.res.write("C");
        };
      })
      .get("/", (ctx) => {
        ctx.res.write("B");
      });

    return request(app.handler).get("/").expect("ABC").expect(200);
  });

  it("Handles multiple middlewares", () => {
    const app = new Routex();

    app
      .middleware([
        (ctx) => {
          ctx.res.write("A");
        },
        (ctx) => {
          ctx.res.write("B");
        },
      ])
      .get("/", (ctx) => {
        ctx.res.write("C");
      });

    return request(app.handler).get("/").expect("ABC").expect(200);
  });

  it("Handles missing middleware", () => {
    const app = new Routex();

    app
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      .middleware()
      .get("/", (ctx: ICtx) => {
        ctx.res.write("A");
      });

    return request(app.handler).get("/").expect("A").expect(200);
  });

  it("Handles express middleware", () => {
    const app = new Routex();

    app
      .middleware(
        useExpress((req: any, res: any, next: any) => {
          res.write("A");

          next();
        })
      )
      .get(
        "/",
        useExpress((req: any, res: any) => {
          res.write("B");
        })
      );

    return request(app.handler).get("/").expect("AB").expect(200);
  });

  it("Has params in middleware", () => {
    const app = new Routex();

    app
      .middleware((ctx) => {
        ctx.data.name = ctx.params.name;
      })
      .get("/:name", (ctx) => new TextBody(ctx.data.name));

    return request(app.handler).get("/test").expect("test").expect(200);
  });
});

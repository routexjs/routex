import * as request from "supertest";
import { Routex, useExpress } from "../src";

it("Handles middleware", () => {
  const app = new Routex();

  app
    .middleware(ctx => {
      ctx.res.write("A");

      return () => {
        ctx.res.write("C");
      };
    })
    .get("/", ctx => {
      ctx.res.write("B");
    });

  return request(app.handler)
    .get("/")
    .expect("ABC")
    .expect(200);
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

  return request(app.handler)
    .get("/")
    .expect("AB")
    .expect(200);
});

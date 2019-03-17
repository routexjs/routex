import * as request from "supertest";
import { Routar, useExpress } from "../src";

it("Handles middleware", () => {
  const app = new Routar();

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
  const app = new Routar();

  app
    .middleware(
      useExpress((req, res, next) => {
        res.write("A");

        next();
      })
    )
    .get("/", ctx => {
      ctx.res.write("B");
    });

  return request(app.handler)
    .get("/")
    .expect("AB")
    .expect(200);
});

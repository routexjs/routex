import * as request from "supertest";
import { JsonBody, Routex, TextBody } from "../src";

it("Handles query string", () => {
  const app = new Routex();

  app.get("/test", ctx => {
    ctx.body = new TextBody(ctx.query.name);
  });

  return request(app.handler)
    .get("/test?name=john")
    .expect("john")
    .expect(200);
});

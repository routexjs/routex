import * as request from "supertest";
import { Routex, TextBody } from "../src";

it("Handles OPTIONS", () => {
  const app = new Routex();
  app.get("/", ctx => {
    ctx.body = new TextBody("");
  });
  app.get("/", ctx => {
    ctx.body = new TextBody("");
  });
  app.post("/", ctx => {
    ctx.body = new TextBody("");
  });

  return request(app.handler)
    .options("/")
    .expect("Allow", "GET, POST")
    .expect(200);
});

import { AddressInfo } from "net";
import * as request from "supertest";
import { ErrorWithStatusCode, Routar, Router, useCtx } from "../src";

it("Handles 404", () => {
  const app = new Routar();

  return request(app.rootHandler)
    .post("/")
    .expect(404);
});

it("Handles sub-routers error propagation", () => {
  const app = new Routar();

  // Uses app/default error handler
  const child1 = new Router();
  app.use("/1", child1);

  const child2 = new Router();
  child2.errorHandler = () => null;
  app.use("/2", child2);

  const appRequest = request(app.rootHandler);

  return Promise.all([
    appRequest.get("/1").expect(404),
    appRequest.get("/2").expect(200)
  ]);
});

it("Handles error", () => {
  const app = new Routar();

  app.get("/", () => {
    throw new Error("Error");
  });

  return request(app.rootHandler)
    .get("/")
    .expect("Error")
    .expect(500);
});

it("Handles error with status", () => {
  const app = new Routar();

  app.get("/", () => {
    throw new ErrorWithStatusCode(400, "Error");
  });

  return request(app.rootHandler)
    .get("/")
    .expect("Error")
    .expect(400);
});
it("Handles error with status", () => {
  const app = new Routar();

  app.get("/", () => {
    throw new ErrorWithStatusCode(400, "Error");
  });

  return request(app.rootHandler)
    .get("/")
    .expect("Error")
    .expect(400);
});

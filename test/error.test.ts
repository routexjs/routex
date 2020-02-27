import * as request from "supertest";
import {
  ErrorWithStatusCode,
  Routex,
  Router,
  ErrorWithBody,
  TextBody,
  ICtx
} from "../src";

describe("Errors", () => {
  it("Handles 404", () => {
    const app = new Routex();

    return request(app.handler)
      .post("/")
      .expect(404);
  });

  it("Handles sub-routers error propagation", () => {
    const app = new Routex();

    // Uses app/default error handler
    app.child("/1");

    const child2 = new Router();
    child2.errorHandler = () => null;
    app.child("/2", child2);

    const appRequest = request(app.handler);

    return Promise.all([
      appRequest.get("/1").expect(404),
      appRequest.get("/2").expect(200)
    ]);
  });

  it("Handles error", () => {
    const app = new Routex();

    app.get("/", () => {
      throw new Error("Error");
    });

    return request(app.handler)
      .get("/")
      .expect("Error")
      .expect(500);
  });

  it("Handles error with status", () => {
    const app = new Routex();

    app.get("/", () => {
      throw new ErrorWithStatusCode(400, "Error");
    });

    return request(app.handler)
      .get("/")
      .expect("Error")
      .expect(400);
  });

  it("Handles error with body", () => {
    const app = new Routex();

    app.get("/", () => {
      throw new ErrorWithBody(400, new TextBody("Error"));
    });

    return request(app.handler)
      .get("/")
      .expect("Error")
      .expect(400);
  });

  it("Handles custom error handler", () => {
    const app = new Routex({
      errorHandler: (ctx: ICtx) => (ctx.body = new TextBody("Error!"))
    });

    app.get("/", () => {
      throw new Error();
    });

    return request(app.handler)
      .get("/")
      .expect("Error!");
  });
});

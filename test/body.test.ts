import * as request from "supertest";
import { JsonBody, Routex, TextBody } from "../src";

describe("Body", () => {
  it("Handles JSON pretty print", () => {
    const app = new Routex();

    app.get("/", ctx => {
      ctx.body = new JsonBody({ name: "john" }, { pretty: true });
    });

    return request(app.handler)
      .get("/")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "20")
      .expect(200);
  });

  it("Handles custom JSON pretty print", () => {
    const app = new Routex();

    app.get("/", ctx => {
      ctx.body = new JsonBody({ name: "john" }, { pretty: "\t" });
    });

    return request(app.handler)
      .get("/")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "19")
      .expect(200);
  });

  it("Handles string body", () => {
    const app = new Routex();
    app.get("/", ctx => {
      ctx.body = new TextBody("hello");
    });

    return request(app.handler)
      .get("/")
      .expect("hello")
      .expect("Content-Length", "5")
      .expect(200);
  });

  it("Handles returning body", () => {
    const app = new Routex();
    app.get("/", () => {
      return new TextBody("hello");
    });

    return request(app.handler)
      .get("/")
      .expect("hello")
      .expect("Content-Length", "5")
      .expect(200);
  });
});

import { AddressInfo } from "net";
import * as request from "supertest";
import { ErrorWithStatusCode, Routar, Router, useCtx } from "../src";

it("Handles GET index request", () => {
  const app = new Routar();

  app.get("/", (req, res) => {
    res.json({ name: "john" });
  });

  return request(app.rootHandler)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);
});

it("Handles POST index request", () => {
  const app = new Routar();

  app.get("/", (req, res) => {
    res.json({ name: "bonnie" });
  });
  app.post("/", (req, res) => {
    res.json({ name: "john" });
  });

  return request(app.rootHandler)
    .post("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);
});

it("Handles 404", () => {
  const app = new Routar();

  return request(app.rootHandler)
    .post("/")
    .expect(404);
});

it("Handles array handlers", () => {
  const app = new Routar();

  app.get("/", [
    req => {
      // @ts-ignore
      req.name = "john";
    },
    (req, res) => {
      // @ts-ignore
      res.json({ name: req.name });
    }
  ]);

  return request(app.rootHandler)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);
});

it("Handles multiple routes", () => {
  const app = new Routar();

  app.get("/women", (req, res) => {
    res.json({ name: "bonnie" });
  });

  app.get("/man", (req, res) => {
    res.json({ name: "john" });
  });

  app.get("/", (req, res) => {
    res.statusCode = 404;
    res.json({ name: null });
  });

  const appRequest = request(app.rootHandler);

  return Promise.all([
    appRequest
      .get("/man")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "15")
      .expect(200),
    appRequest
      .get("/women")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "17")
      .expect(200),
    appRequest
      .get("/")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "13")
      .expect(404)
  ]);
});

it("Handles sub-routers", () => {
  const app = new Routar();

  const childRouter = new Router();

  childRouter.get("/", (req, res) => {
    res.json({ name: "joey" });
  });

  app.use("/child", childRouter);

  app.get("/", (req, res) => {
    res.statusCode = 404;
    res.json({ name: null });
  });

  const appRequest = request(app.rootHandler);

  return Promise.all([
    appRequest
      .get("/child")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "15")
      .expect(200),
    appRequest
      .get("/")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "13")
      .expect(404)
  ]);
});

it("Handles useCtx", () => {
  const app = new Routar();

  app.get(
    "/",
    useCtx(ctx => {
      ctx.body = {
        name: "john"
      };
    })
  );

  return request(app.rootHandler)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);
});

it("Handles JSON pretty print", () => {
  const app = new Routar();

  app.get("/", (req, res) => {
    res.json({ name: "john" }, { pretty: true });
  });

  return request(app.rootHandler)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "20")
    .expect(200);
});

it("Handles custom JSON pretty print", () => {
  const app = new Routar();

  app.get("/", (req, res) => {
    res.json({ name: "john" }, { pretty: "\t" });
  });

  return request(app.rootHandler)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "19")
    .expect(200);
});

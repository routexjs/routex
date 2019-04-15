import * as request from "supertest";
import { JsonBody, Methods, Routex } from "../src";

it("Handles GET/POST/DELETE/PATCH/PUT index request", () => {
  const app = new Routex();

  app
    .get("/", ctx => {
      ctx.body = new JsonBody({ name: "bonnie" });
    })
    .post("/", ctx => {
      ctx.body = new JsonBody({ name: "john" });
    })
    .delete("/", ctx => {
      ctx.body = new JsonBody({ name: "johnny" });
    })
    .patch("/", ctx => {
      ctx.body = new JsonBody({ name: "hayley" });
    })
    .put("/", ctx => {
      ctx.body = new JsonBody({ name: "charles" });
    })
    .route(Methods.GET, "/sub", ctx => {
      ctx.body = new JsonBody({ name: "joey" });
    })
    .route([Methods.POST], "/sub", ctx => {
      ctx.body = new JsonBody({ name: "matthew" });
    })
    .any("/any", ctx => {
      ctx.body = new JsonBody({ name: "tim" });
    });

  const handler = request(app.handler);

  return Promise.all([
    handler
      .get("/")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "17")
      .expect(200),
    handler
      .post("/")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "15")
      .expect(200),
    handler
      .delete("/")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "17")
      .expect(200),
    handler
      .patch("/")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "17")
      .expect(200),
    handler
      .put("/")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "18")
      .expect(200),
    handler
      .get("/sub")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "15")
      .expect(200),
    handler
      .post("/sub")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "18")
      .expect(200),
    handler
      .get("/any")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "14")
      .expect(200)
  ]);
});

it("Handles 404", () => {
  const app = new Routex();

  return request(app.handler)
    .post("/")
    .expect(404);
});

it("Handles array handlers", () => {
  const app = new Routex();

  app.get("/", [
    ctx => {
      // @ts-ignore
      ctx.data.name = "john";
    },
    ctx => {
      // @ts-ignore
      ctx.body = new JsonBody({ name: ctx.data.name });
    }
  ]);

  return request(app.handler)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);
});

it("Handles multiple routes", () => {
  const app = new Routex();

  app
    .get("/women", ctx => {
      ctx.body = new JsonBody({ name: "bonnie" });
    })
    .get("/man", ctx => {
      ctx.body = new JsonBody({ name: "john" });
    })
    .get("/", ctx => {
      ctx.statusCode = 404;
      ctx.body = new JsonBody({ name: null });
    });

  const appRequest = request(app.handler);

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
  const app = new Routex();

  app.child("/child").get("/", ctx => {
    ctx.body = new JsonBody({ name: "joey" });
  });

  app.get("/", ctx => {
    ctx.statusCode = 404;
    ctx.body = new JsonBody({ name: null });
  });

  const handler = request(app.handler);

  return Promise.all([
    handler
      .get("/child")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "15")
      .expect(200),
    handler
      .get("/")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "13")
      .expect(404)
  ]);
});

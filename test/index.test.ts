import * as request from "supertest";
import { Routar, useCtx } from "../src";
import { Methods } from "../src/router";

it("Handles GET/POST/DELETE/PATCH/PUT index request", () => {
  const app = new Routar();

  app
    .get("/", (req, res) => {
      res.json({ name: "bonnie" });
    })
    .post("/", (req, res) => {
      res.json({ name: "john" });
    })
    .delete("/", (req, res) => {
      res.json({ name: "johnny" });
    })
    .patch("/", (req, res) => {
      res.json({ name: "hayley" });
    })
    .put("/", (req, res) => {
      res.json({ name: "charles" });
    })
    .route(Methods.GET, "/sub", (req, res) => {
      res.json({ name: "joey" });
    })
    .route([Methods.POST], "/sub", (req, res) => {
      res.json({ name: "matthew" });
    })
    .any("/any", (req, res) => {
      res.json({ name: "tim" });
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
  const app = new Routar();

  return request(app.handler)
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

  return request(app.handler)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);
});

it("Handles multiple routes", () => {
  const app = new Routar();

  app
    .get("/women", (req, res) => {
      res.json({ name: "bonnie" });
    })
    .get("/man", (req, res) => {
      res.json({ name: "john" });
    })
    .get("/", (req, res) => {
      res.statusCode = 404;
      res.json({ name: null });
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
  const app = new Routar();

  app.child("/child").get("/", (req, res) => {
    res.json({ name: "joey" });
  });

  app.get("/", (req, res) => {
    res.statusCode = 404;
    res.json({ name: null });
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

  return request(app.handler)
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

  return request(app.handler)
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

  return request(app.handler)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "19")
    .expect(200);
});

import * as request from "supertest";
import {
  ICtx,
  JsonBody,
  Methods,
  Middleware,
  Router,
  Routex,
  TextBody,
} from "../src";

describe("Routex", () => {
  it("Handles GET/POST/DELETE/PATCH/PUT index request", () => {
    const app = new Routex();

    app
      .get("/", (ctx) => {
        ctx.body = new JsonBody({ name: "bonnie" });
      })
      .post("/", (ctx) => {
        ctx.body = new JsonBody({ name: "john" });
      })
      .delete("/", (ctx) => {
        ctx.body = new JsonBody({ name: "johnny" });
      })
      .patch("/", (ctx) => {
        ctx.body = new JsonBody({ name: "hayley" });
      })
      .put("/", (ctx) => {
        ctx.body = new JsonBody({ name: "charles" });
      })
      .route(Methods.GET, "/sub", (ctx) => {
        ctx.body = new JsonBody({ name: "joey" });
      })
      .route([Methods.POST], "/sub", (ctx) => {
        ctx.body = new JsonBody({ name: "matthew" });
      })
      .any("/any", (ctx) => {
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
        .expect(200),
    ]);
  });

  it("Handles 404", () => {
    const app = new Routex();

    return request(app.handler).post("/").expect(404);
  });

  it("Handles array handlers", () => {
    const app = new Routex();

    app.get("/", [
      (ctx) => {
        // @ts-ignore
        ctx.data.name = "john";
      },
      (ctx) => {
        // @ts-ignore
        ctx.body = new JsonBody({ name: ctx.data.name });
      },
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
      .get("/women", (ctx) => {
        ctx.body = new JsonBody({ name: "bonnie" });
      })
      .get("/man", (ctx) => {
        ctx.body = new JsonBody({ name: "john" });
      })
      .get("/", (ctx) => {
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
        .expect(404),
    ]);
  });

  it("Handles sub-routers", () => {
    const app = new Routex();

    app.child("/child").get("/", (ctx) => {
      ctx.body = new JsonBody({ name: "joey" });
    });

    app.get("/", (ctx) => {
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
        .expect(404),
    ]);
  });

  it("Handles sub-routers with middlewares", () => {
    const app = new Routex();

    const write = (x: string): Middleware => (ctx: ICtx) => {
      ctx.res.write(x);
    };

    app.child("/a", [null, write("A")]).get("/", () => {});
    app.child("/ab", [null, [write("A"), write("B")]]).get("/", () => {});

    const c = new Router();
    c.get("/", (ctx) => {
      ctx.res.write("C");
    });

    app.child("/abc", [c, [write("A"), write("B")]]);

    const handler = request(app.handler);

    return Promise.all([
      handler.get("/a").expect(200).expect("A"),
      handler.get("/ab").expect(200).expect("AB"),
      handler.get("/abc").expect(200).expect("ABC"),
    ]);
  });

  it("Handles full sub-routers", () => {
    const app = new Routex();

    app
      .child("/")
      .child("/test")
      .get("/child", (ctx) => {
        ctx.body = new JsonBody({ name: "joey" });
      });

    return request(app.handler)
      .get("/test/child")
      .expect("Content-Type", /json/)
      .expect("Content-Length", "15")
      .expect(200);
  });

  it("Handles sub-routers with matching paths", () => {
    const app = new Routex();

    app.child("/test/test").get("/b", (ctx) => {
      ctx.body = new TextBody("B");
    });

    app.child("/test").get("/a", (ctx) => {
      ctx.body = new TextBody("A");
    });

    const handler = request(app.handler);

    return Promise.all([
      handler.get("/test/a").expect(200).expect("A"),
      handler.get("/test/test/b").expect(200).expect("B"),
    ]);
  });

  it("Handles params", () => {
    const app = new Routex();

    app
      .get("/letter/:letter?", (ctx) => {
        ctx.body = new TextBody(ctx.params.letter || "");
      })
      .get("/:name", (ctx) => {
        ctx.body = new JsonBody({ name: ctx.params.name });
      });

    const handler = request(app.handler);

    return Promise.all([
      handler
        .get("/john")
        .expect("Content-Type", /json/)
        .expect("Content-Length", "15")
        .expect(200),
      handler
        .get("/john%20smith")
        .expect("Content-Type", /json/)
        .expect("Content-Length", "21")
        .expect(200),
      handler.get("/letter/a").expect("a").expect(200),
      handler.get("/letter").expect("").expect(200),
      handler.get("/letter/%^").expect(500),
    ]);
  });

  it("Has request ID", () => {
    const appUuid = new Routex();
    appUuid.get("/", (ctx) => {
      ctx.body = new TextBody(ctx.requestId!);
    });

    const appFixed = new Routex({ requestId: () => "FIXED" });
    appFixed.get("/", (ctx) => {
      ctx.body = new TextBody(ctx.requestId!);
    });

    const appNone = new Routex({ requestId: false });
    appNone.get("/", (ctx) => {
      ctx.body = new TextBody(ctx.requestId === undefined ? "YES" : "NO");
    });

    return Promise.all([
      request(appUuid.handler)
        .get("/")
        .expect(({ text }) => expect(text.length).toBe(36)),
      request(appFixed.handler).get("/").expect("FIXED"),
      request(appNone.handler).get("/").expect("YES"),
    ]);
  });
});

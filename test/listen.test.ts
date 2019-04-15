import * as request from "supertest";
import { JsonBody, Routex } from "../src";

it("Handles listen on random port", async () => {
  const app = new Routex();

  app.get("/", ctx => {
    ctx.body = new JsonBody({ name: "john" });
  });

  const { close, port } = await app.listen();

  await request(`http://localhost:${port}`)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);

  await close();
});

it("Handles listen on assigned port", async () => {
  const app = new Routex();

  app.get("/", ctx => {
    ctx.body = new JsonBody({ name: "john" });
  });

  const { close, port } = await app.listen(9999);

  await request(`http://localhost:${port}`)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);

  await close();
});

it("Handles listen on assigned string port", async () => {
  const app = new Routex();

  app.get("/", ctx => {
    ctx.body = new JsonBody({ name: "john" });
  });

  const { close, port } = await app.listen("9998");

  await request(`http://localhost:${port}`)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);

  await close();
});

it("Catches listen on invalid port", async () => {
  const app = new Routex();

  app.get("/", ctx => {
    ctx.body = new JsonBody({ name: "john" });
  });

  await expect(app.listen("invalid port")).rejects.toThrow();
});

it("Catches listen on invalid hostname", async () => {
  const app = new Routex();

  app.get("/", ctx => {
    ctx.body = new JsonBody({ name: "john" });
  });

  // @ts-ignore
  await expect(app.listen(undefined, { hostname: 1 })).rejects.toThrow();
});

import { AddressInfo } from "net";
import * as request from "supertest";
import { Routar } from "../src";

it("Handles listen on random port", async () => {
  const app = new Routar();

  app.get("/", (req, res) => res.json({ name: "john" }));

  const server = await app.listen();

  await request(`http://localhost:${(server.address() as AddressInfo).port}`)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);

  await new Promise(resolve => server.close(resolve));
});

it("Handles listen on assigned port", async () => {
  const app = new Routar();

  app.get("/", (req, res) => res.json({ name: "john" }));

  const server = await app.listen(9999);

  await request(`http://localhost:${(server.address() as AddressInfo).port}`)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);

  await new Promise(resolve => server.close(resolve));
});

it("Handles listen on assigned string port", async () => {
  const app = new Routar();

  app.get("/", (req, res) => res.json({ name: "john" }));

  const server = await app.listen("9998");

  await request(`http://localhost:${(server.address() as AddressInfo).port}`)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);

  await new Promise(resolve => server.close(resolve));
});

it("Catches listen on invalid port", async () => {
  const app = new Routar();

  app.get("/", (req, res) => res.json({ name: "john" }));

  await expect(app.listen("invalid port")).rejects.toThrow();
});

it("Catches listen on invalid hostname", async () => {
  const app = new Routar();

  app.get("/", (req, res) => res.json({ name: "john" }));

  // @ts-ignore
  await expect(app.listen(undefined, { hostname: 1 })).rejects.toThrow();
});

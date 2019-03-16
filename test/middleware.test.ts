import * as request from "supertest";
import { Routar, useExpressNext } from "../src";

it("Handles middleware", () => {
  const app = new Routar();

  app
    .middleware((req, res) => {
      res.write("A");

      return () => {
        res.write("C");
      };
    })
    .get("/", (req, res) => {
      res.write("B");
    });

  return request(app.handler)
    .get("/")
    .expect("ABC")
    .expect(200);
});

it("Handles express middleware", () => {
  const app = new Routar();

  app
    .middleware(
      useExpressNext((req, res, next) => {
        res.write("A");

        next();
      })
    )
    .get("/", (req, res) => {
      res.write("B");
    });

  return request(app.handler)
    .get("/")
    .expect("AB")
    .expect(200);
});

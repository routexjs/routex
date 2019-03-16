import * as request from "supertest";
import { Routar } from "../src";

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

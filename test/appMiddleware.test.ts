import * as request from "supertest";
import { Routex, useExpress } from "../src";

it("Calls app middlewares", async () => {
  let calledAppMiddleware = false;
  let calledInitializeServer = false;

  const appMiddleware = () => {
    calledAppMiddleware = true;
    return {
      initializeServer() {
        calledInitializeServer = true;
      }
    };
  };

  const app = new Routex();
  app.appMiddleware(appMiddleware);

  const { close } = await app.listen();

  expect(calledAppMiddleware).toBeTruthy();
  expect(calledInitializeServer).toBeTruthy();

  await close();
});

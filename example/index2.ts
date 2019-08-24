import * as uuid from "uuid";
import { ICtx, JsonBody, Routex } from "../src";

const port = process.env.PORT || 3003;

const app = new Routex();

const body: any = {};
[...Array(10000)].forEach(() => {
  body[uuid()] = {
    [uuid()]: uuid(),
    [uuid()]: uuid()
  };
});

app.get("/", async (ctx: ICtx) => {
  ctx.body = new JsonBody(body);
});

app.listen(port).then(({ port: listeningPort }) => {
  console.log(`Listening on ${listeningPort}`);
});

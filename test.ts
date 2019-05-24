import {
  ErrorWithStatusCode,
  JsonBody,
  Routex,
  TextBody,
  useExpress
} from "./src";

const port = process.env.PORT || 3000;

const app = new Routex();

app.get("/", async ctx => {
  ctx.body = new TextBody(`Index ${ctx.workerId}`);
});

console.log("a");

app.cluster(port).then(results => {
  console.log(results);
});

import {
  ErrorWithStatusCode,
  ICtx,
  JsonBody,
  Routex,
  TextBody,
  useExpress,
} from "../src";

class ValidationError extends ErrorWithStatusCode {
  public constructor(message?: string) {
    super(400, message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const port = process.env.PORT || 3000;

const app = new Routex();

app
  .get("/", async (ctx: ICtx) => {
    ctx.body = new TextBody("Index");
  })
  .get("/error", [
    () => {
      throw new ValidationError("Some error");
    },
    (ctx: ICtx) => {
      ctx.body = new TextBody("Will never be returned");
    },
  ])
  .get(
    "/express",
    useExpress((req: any, res: any) => {
      res.write("Express!");
    })
  )
  .get("/delay", async (ctx: ICtx) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    ctx.body = new TextBody("Delayed");
  })
  .get(
    "/catch",
    (ctx: ICtx) => {
      ctx.body = new TextBody("Catch");
    },
    { exact: false }
  );

app
  .child("/child")
  .middleware((ctx: ICtx) => {
    ctx.res.setHeader("X-Server", "Routex");
    ctx.data.name = "john";
  })
  .get("/", (ctx: ICtx) => {
    ctx.body = new TextBody("Child index");
  })
  .get("/json", (ctx: ICtx) => {
    ctx.body = new JsonBody({ child: true, name: ctx.data.name });
  });

app.listen(port).then(({ port: listeningPort }) => {
  console.log(`Listening on ${listeningPort}`);
});

const {
  ErrorWithStatusCode,
  JsonBody,
  Routex,
  TextBody,
  useExpress
} = require("../dist/lib");

class ValidationError extends ErrorWithStatusCode {
  constructor(message) {
    super(400, message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const port = process.env.PORT || 3000;

const app = new Routex();

app
  .get("/", async ctx => {
    ctx.body = new TextBody("Index");
  })
  .get("/error", [
    () => {
      throw new ValidationError("Some error");
    },
    ctx => {
      ctx.body = new TextBody("Will never be returned");
    }
  ])
  .get(
    "/express",
    useExpress((req, res) => {
      res.write("Express!");
    })
  )
  .get("/delay", async ctx => {
    await new Promise(resolve => setTimeout(resolve, 500));
    ctx.body = new TextBody("Delayed");
  })
  .get(
    "/catch",
    ctx => {
      ctx.body = new TextBody("Catch");
    },
    { exact: false }
  );

app
  .child("/child")
  .middleware(ctx => {
    ctx.res.setHeader("X-Server", "Routex");
    ctx.data.name = "john";
  })
  .get("/", ctx => {
    ctx.body = new TextBody("Child index");
  })
  .get("/json", ctx => {
    ctx.body = new JsonBody({ child: true, name: ctx.data.name });
  });

app.listen(port).then(({ port: listeningPort }) => {
  console.log(`Listening on ${listeningPort}`);
});

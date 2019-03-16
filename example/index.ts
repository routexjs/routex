import { ErrorWithStatusCode, Routar, useCtx } from "../src";

class ValidationError extends ErrorWithStatusCode {
  constructor(message?: string) {
    super(400, message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const port = process.env.PORT || 3000;

const app = new Routar();

app
  .get("/", async (req, res) => {
    res.write("Index");
  })
  .get("/error", [
    () => {
      throw new ValidationError("Some error");
    },
    (req, res) => res.json("Will never be returned")
  ])
  .get(
    "/ctx",
    useCtx(ctx => {
      ctx.body = {
        rootCtx: "Works!"
      };
    })
  )
  .get("/delay", async (req, res) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    res.write("Delayed");
  })
  .get(
    "/catch",
    (req, res) => {
      res.write("Catch");
    },
    { exact: false }
  );

app
  .child("/child")
  .middleware((req, res) => {
    res.setHeader("X-Server", "Routar");
    req.data.name = "john";
  })
  .get("/", (req, res) => {
    res.write("Child Index");
  })
  .get("/json", (req, res) => {
    res.json({ child: true, name: req.data.name });
  });

app.listen(port).then(({ port: listeningPort }) => {
  // tslint:disable-next-line:no-console
  console.log(`Listening on ${listeningPort}`);
});

import { Routar, Router, useCtx, ErrorWithStatusCode } from "../src";

class ValidationError extends ErrorWithStatusCode {
  constructor(message?: string) {
    super(400, message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const app = new Routar();

const childRouter = new Router();
childRouter.get("/json", (req, res) => {
  res.json({ child: true });
});
childRouter.get("/", (req, res) => {
  res.write("Child Index");
});

app.use("/child", childRouter);

app.get("/error", [
  () => {
    throw new ValidationError("error");
  },
  (req, res) => res.json("Will never be returned")
]);

app.get(
  "/ctx",
  useCtx(ctx => {
    ctx.body = {
      rootCtx: "Works!"
    };
  })
);

app.get("/delay", async (req, res) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  res.write("Delayed");
});

app.get("/", async (req, res) => {
  res.write("Index");
});

const port = process.env.PORT || 3000;

app.listen(port).then(() => {
  console.log(`Listening on ${port}`);
});

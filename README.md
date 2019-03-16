# Routar ![npm](https://img.shields.io/npm/v/routar.svg) ![Travis (.com)](https://img.shields.io/travis/com/Cretezy/routar.svg)

Modern Node router.

Features:

- Easy to use, good performance
- Modern API, native Promise support, fully typed (TypeScript)
- Close compatibility with Express/Koa, fast migration
- Few dependencies (currently: 1), small API surface, easy to fully understand
- 100% code coverage, well tested

## Usage

Install:

```bash
yarn add routar
# or
npm add routar
```

Setup your app:

```js
const { Routar } = require("routar");

const port = process.env.PORT || 3000;
const app = new Routar();

app.get("/", (req, res) => {
  res.write("Hello world!");
});

app.listen(port).then(() => console.log(`Listening on ${port}`));
```

[Full example](example)

### Routes

Routing in Routar is slightly different from other routes, but is targeted towards making it much simpler.

To start, you can use the `.get`, `.post`, `.delete`, `.patch`, `.put`, and `.any` (all aliasing to `.route`) to attach single routes to a router. These methods are chainable, and can be in any order (uses exact match):

```js
app
  .get("/", (req, res) => {
    res.write("GET /");
  })
  .post("/submit", (req, res) => {
    res.write("POST /submit");
  })
  .get(
    "/catch",
    (req, res) => {
      res.write("GET /catch/*");
    },
    { exact: false }
  );

// Long form
app.route("POST", "/", (req, res) => {
  res.write("GET /");
});

app.any("/", (req, res) => {
  // Will catch all other methods on /
  res.write("DELETE/PUTCH/PUT /");
});
```

### Child Routers

Child routers are useful to functionally split your application in smaller units:

```js
app.child("/child").get("/", (req, res) => {
  res.write("GET /child");
});

// Or

const { Router } = require("routar");

const parentsRouter = new Router();

parentsRouter.get("/", (req, res) => {
  res.write("GET /parents");
});

app.child("/parents", parentsRouter);
```

### Handler

A handler can be:

- A function (`(res, res) => ...`)
- A Promise (`async (res, res) => ...`)
- A router (`new Router()`)
- A list of handlers (`[middleware, (req, res) => ..., router]`)

### Middlewares

Middlewares are triggered at the start and end of handing a router. A middleware is a handler that can return a function/Promise (to be called at the end of the request):

```js
app
  .middleware((req, res) => {
    // Attaches data to the request in the root router
    req.data.name = "john";
  })
  .get("/", (req, res) => {
    res.json({ name: req.data.name });
  });

app
  .child("/child")
  .middleware((req, res) => {
    return () => {
      // Will append ' ... Smith!' to all requets in this router
      res.write(" ... Smith!");
    };
  })
  .get("/", (req, res) => {
    res.write(`My name is ${req.data.name}`);
  });
```

### Listening

Using `app.listen` is a simple way to start your Routar server:

```js
// Can parse port from string
app.listen(process.env.PORT || 3000);

// Will randomly assign port
app.listen();

// Returns a Promise with port and server
app.listen().then(async ({ port, server, close }) => {
  console.log(`Listening on :${port}`);
  console.log(`Max connections: ${server.maxConnections}`);

  // Wait 1s
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Close server,
  await close();
});
```

To use in testing or in `http.createServer`, you can use `app.handler`:

```js
const server = http.createServer(app.handler);

// Using supertest

request(app.handler);
```

## Support

We support all currently active and maintained [Node LTS versions](https://github.com/nodejs/Release), include current Node versions.

Please file feature requests and bugs at the [issue tracker](https://github.com/Cretezy/routar/issues).

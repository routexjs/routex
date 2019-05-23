# Routex [![npm](https://img.shields.io/npm/v/routex.svg)](https://www.npmjs.com/package/routex) [![Travis CI](https://img.shields.io/travis/com/Cretezy/routex.svg)](https://travis-ci.com/Cretezy/routex) [![Codecov](https://img.shields.io/codecov/c/github/Cretezy/routex.svg)](https://codecov.io/gh/Cretezy/routex) [![Greenkeeper badge](https://badges.greenkeeper.io/Cretezy/routex.svg)](https://greenkeeper.io/)

Modern Node router.

Features:

- Easy to use, good performance
- Modern API, native Promise support, fully typed (TypeScript)
- Close compatibility with Express/Koa, fast migration
- Very few dependencies, small API surface, easy to fully understand and extend
- 100% code coverage, well tested

## Usage

Install:

```bash
yarn add routex
# or
npm add routex
```

Setup your app:

```js
const { Routex, TextBody } = require("routex");

const port = process.env.PORT || 3000;
const app = new Routex();

app.get("/", ctx => {
  ctx.body = new TextBody("Hello world!");
});

app.listen(port).then(() => console.log(`Listening on ${port}`));
```

[Full example](example)

### Routes

Routing in Routex is slightly different from other routes, but is targeted towards making it much simpler.

To start, you can use the `.get`, `.post`, `.delete`, `.patch`, `.put`, and `.any` (all aliasing to `.route`) to attach single routes to a router.
These methods are chainable, and can be in any order (uses exact match):

```js
const { TextBody, JsonBody } = require("routex");

app
  .get("/", ctx => {
    ctx.body = new TextBody("GET /");
  })
  .post("/submit", ctx => {
    ctx.body = new TextBody("POST /submit");
    ctx.statusCode = 400;
  })
  .get("/json", ctx => {
    ctx.body = new JsonBody({ name: "john" });
  })
  .get(
    "/catch",
    ctx => {
      ctx.body = new TextBody("GET /catch/*");
    },
    { exact: false }
  );

// Long form
app.route("POST", "/", ctx => {
  ctx.body = new TextBody("GET /");
});

app.any("/", ctx => {
  // Will catch all other methods on /
  ctx.body = new TextBody("DELETE/PUTCH/PUT /");
});
```

### Params

Params are available with the same syntax as [`path-to-regexp`](https://npmjs.org/package/path-to-regexp):

```js
app.get("/:name", ctx => {
  ctx.body = new TextBody(ctx.params.name);
});
```

### Child Routers

Child routers are useful to functionally split your application in smaller units:

```js
app.child("/child").get("/", ctx => {
  ctx.body = new TextBody("GET /child");
});

// Or

const { Router } = require("routex");

const parentsRouter = new Router();

parentsRouter.get("/", ctx => {
  ctx.body = new TextBody("GET /parents");
});

app.child("/parents", parentsRouter);
```

You can also apply middlewares when creating child routers:

```js
const firstNameMiddleware = ctx => {
  ctx.data.firstName = "john";
};
const lastNameMiddleware = ctx => {
  ctx.data.lastName = "smith";
};

const { Router } = require("routex");
const childRouter = new Router();

app.child("/firstName", [childRouter, firstNameMiddleware]);
app.child("/name", [childRouter, [firstNameMiddleware, lastNameMiddleware]]);

// Or

app.child("/firstName", [null, firstNameMiddleware]);
app.child("/name", [null, [firstNameMiddleware, lastNameMiddleware]]);
```

### Handler

A handler can be:

- A function (`(ctx) => ...`)
- A Promise (`async (ctx) => ...`)
- A router (`new Router()`)
- A list of handlers (`[middleware, (ctx) => ..., router]`)

### Middlewares

Middlewares are triggered at the start and end of handing a router.
A middleware is a handler that can return a function/Promise (to be called at the end of the request):

```js
app
  .middleware(ctx => {
    // Attaches data to the request in the root router
    ctx.data.name = "john";
  })
  .get("/", ctx => {
    ctx.body = new JsonBody({ name: ctx.data.name });
  });

app
  .child("/child")
  .middleware(ctx => {
    return () => {
      // Will append ' ... smith!' to all requests in this router
      ctx.res.write(" ... smith!");
    };
  })
  .get("/", ctx => {
    ctx.res.write(`My name is ${ctx.data.name}`);
  });
```

You can also apply multiple middlewares at once:

```js
app
  .middleware([
    ctx => {
      ctx.data.firstName = "john";
    },
    ctx => {
      ctx.data.lastName = "smith";
    }
  ])
  .get("/", ctx => {
    ctx.body = new JsonBody({
      firstName: ctx.data.firstName,
      lastName: ctx.data.lastName
    });
  });
```

#### Express Middlewares

Routex has built-in support for Express/Connect/callback style middlewares.

```js
const { useExpress, JsonBody } = require("routex");
const bodyParser = require("body-parser");

app.middleware(useExpress(bodyParser.json()));

app.post("/", ctx => {
  ctx.body = new JsonBody({ data: ctx.req.body });
});
```

This enables the `(req, res) => ...` or `(req, res, next) => ...` syntax.

### Listening

Using `app.listen` is a simple way to start your Routex server:

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

// Using a custom http.Server
const server = http.createServer(app.handler);
app.listen({ server });
```

To use in testing or in `http.createServer`, you can use `app.handler`:

```js
const server = http.createServer(app.handler);

// Using supertest

request(app.handler);
```

### Data

#### Query String

Query string is parsed using `ctx.query`, as an object:

```js
app.get("/", ctx => {
  ctx.body = new TextBody(ctx.query.name);
});
```

#### Headers

Headers are under `ctx.req.headers`.
Make sure to use the lowercase key name (`Authorization` because `authorization`):

```js
app.get("/", ctx => {
  ctx.body = new TextBody(ctx.req.headers.host);
});
```

#### Body

For body parsing, use [`@routex/body-parser`](https://www.npmjs.com/package/@routex/body-parser).

#### Cookies

For cookies, use [`@routex/cookies`](https://www.npmjs.com/package/@routex/cookies).

#### WebSockets

For WebSockets, use [`@routex/websocket`](https://www.npmjs.com/package/@routex/websocket).

### App Middleware

App middlewares are designed to be low-level to customize the server.
An example is [`@routex/websocket`](https://www.npmjs.com/package/@routex/websocket).

```js
const myAppMiddleware = routex => ({
  initializeServer(server) {
    // Do something with the http.Server, before starting to listen
  }
});

// Apply it
app.appMiddleware(myAppMiddleware);
```

## Support

We support all currently active and maintained [Node LTS versions](https://github.com/nodejs/Release),
include current Node versions.

Please file feature requests and bugs at the [issue tracker](https://github.com/Cretezy/routex/issues).

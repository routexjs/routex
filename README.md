# Routex [![npm](https://img.shields.io/npm/v/routex.svg)](https://www.npmjs.com/package/routex) [![Travis CI](https://img.shields.io/travis/com/Cretezy/routex.svg)](https://travis-ci.com/Cretezy/routex) [![Codecov](https://img.shields.io/codecov/c/github/Cretezy/routex.svg)](https://codecov.io/gh/Cretezy/routex) [![Greenkeeper badge](https://badges.greenkeeper.io/Cretezy/routex.svg)](https://greenkeeper.io/)

Modern Node router.

[Documentation](https://routex.netlify.com) - [GitHub](https://github.com/Cretezy/routex)

### Features

- Easy to use, good performance
- Modern API, native Promise support, fully typed (TypeScript)
- Close compatibility with Express/Koa, fast migration
- Very few dependencies, small API surface, easy to fully understand and extend
- 100% code coverage, well tested

## Example

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

## Support

We support all currently active and maintained [Node LTS versions](https://github.com/nodejs/Release),
include current Node versions.

Please file feature requests and bugs at the [issue tracker](https://github.com/Cretezy/routex/issues).

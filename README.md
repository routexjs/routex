<div align="center"> 
  <img width="200px" src="https://routex.js.org/img/icon.svg" />
  <p><strong>Routex</strong>: Modern Node router</p>
  <p><a href="https://www.npmjs.com/package/routex"><img src="https://img.shields.io/npm/v/routex.svg" alt="npm"></a> <a href="https://travis-ci.com/routexjs/routex"><img src="https://img.shields.io/travis/com/routexjs/routex.svg" alt="Travis CI"></a> <a href="https://codecov.io/gh/routexjs/routex"><img src="https://img.shields.io/codecov/c/github/routexjs/routex.svg" alt="Codecov"></a></p>
</div>


[Documentation](https://routex.js.org) - [GitHub](https://github.com/routexjs/routex)

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

app.get("/", (ctx) => {
  ctx.body = new TextBody("Hello world!");
});

app.listen(port).then(() => console.log(`Listening on ${port}`));
```

## Support

We support all currently active and maintained [Node LTS versions](https://github.com/nodejs/Release),
include current Node versions.

Please file feature requests and bugs at the [issue tracker](https://github.com/routexjs/routex/issues).

# Routar

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

## Support

We support all currently active and maintained [Node LTS versions](https://github.com/nodejs/Release), include current Node versions.

Please file feature requests and bugs at the [issue tracker](https://github.com/Cretezy/routar/issues).

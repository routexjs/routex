## 0.0.15 - 2019-05-25

- Move org & docs
- Add content type to `TextBody` & `JsonBody`
- Small refactor

## 0.0.14 - 2019-05-23

- Add HTTPS
- Add clustering
- Add request ID

## 0.0.13 - 2019-05-23

- Add app middlewares
- Add more code documentation
- Small refactor

## 0.0.12 - 2019-05-19

- Add params

## 0.0.11 - 2019-05-19

- Add attaching multiple middlewares at once
- Add creating sub-routers with middlewares

## 0.0.10 - 2019-05-18

- Add handling for `OPTIONS`

## 0.0.9 - 2019-05-18

- Add documentation on query string, headers, body parser, and cookies
- Export `Middleware`

## 0.0.8 - 2019-05-17

- Allow full child routers
- Add query string handling (under `ctx.query`)
  - Fix matching with query string

## 0.0.7 - 2019-05-17

- Re-release of v0.0.6 (forgot to build again)

## 0.0.6 - 2019-05-17

- Exported `ICtx`

## 0.0.5 - 2019-04-25

- Re-release of v0.0.4 (forgot to build)

## 0.0.4 - 2019-04-25

- Exported `Handler`

## 0.0.3 - 2019-04-15

- Change `(req, res) => ...` to `ctx => ...`
- Add `ctx.body`
  - Add `JsonBody`
  - Add `TextBody`
- Change `req.data` to `ctx.data`
- Add `useExpress` for Express/Connect/callback style middlewares

## 0.0.2 - 2019-03-16

- Add more documentation to README
- Add middlewares
- Add `router.child`, remove `router.use`
- Add `router.route`, `router.any`
- Add `PATCH`, `PUT`, `DELETE` methods
- Add `port` and `close` to `app.listen` return
- Rename `app.rootHandler` to `app.handler`
- Add chaining routes
- Add exact route matching with route options
- Add multiple method routes

## 0.0.1 - 2019-03-16

- Initial release

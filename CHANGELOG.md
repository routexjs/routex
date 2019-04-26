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

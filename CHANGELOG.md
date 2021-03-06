## 1.0.1 - 2020-05-08

- Change `ctx.req` from `http.IncomingMessage` to `ICtxRequest` (which extends `IncomingMessage`)
  - This fixes many problems with types for `@routex/body-parser`
- Upgrade dev dependencies

## 1.0.0 - 2020-04-12

- Graduate to v1.0.0
- Require Node 10
- Export `IRouteOptions`

## 1.0.0-rc.9 - 2020-04-10

- Fix empty chunk
- Clean development environment
  - Remove typings for Superagent
  - Update ESLint config

## 1.0.0-rc.8 - 2020-04-10

- Upgrade dependencies
- Fix small typing bug with previous update of middleware type

## 1.0.0-rc.7 - 2020-04-09

- Update handler/middleware types, add `MiddlewareNext`

## 1.0.0-rc.6 - 2020-02-27

- Add `error` to context
  - Add catching in `Routex.runHandler`

## 1.0.0-rc.5 - 2020-02-27

- Add `Routex.createCtx` and `Routex.runHandler` as testing helpers

## 1.0.0-rc.4 - 2020-02-27

- Fix bug with middleware applying before params parsing

## 1.0.0-rc.3 - 2020-02-27

- Remove support for Node 8

## 1.0.0-rc.2 - 2020-02-27

- Upgrade dependencies
- Added body return in handler
- Added/refactored some tests

## 1.0.0-rc.1 - 2019-12-07

- Upgrade dependencies

## 0.1.0-rc.3 - 2019-10-07

- Upgrade dependencies

## 0.1.0-rc.2 - 2019-08-24

- Fix large body not fully sending again
- Change `IBody` to use Buffers

## 0.1.0-rc.1 - 2019-08-24

- First beta release candidate!
- Fix large body not fully sending
- Upgrade dependencies

## 0.0.18 - 2019-08-04

- Export `ICtxData` and `ICtxProviders`

## 0.0.17 - 2019-08-04

- Upgrade dependencies
- Move to ESLint (from TSLint)
- Add `ICtxData` interface for easier extending
- Add providers and `ICtxProviders`

## 0.0.16 - 2019-06-15

- Add `errorHandler` to Routex class options.
- Move types

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

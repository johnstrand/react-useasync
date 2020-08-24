# useAsync

![npm](https://img.shields.io/npm/v/react-hooks-useasync.svg?label=Latest%20stable)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-hooks-useasync.svg)

A React hook for wrapping async operations

## [Find it on npm](https://www.npmjs.com/package/react-hooks-useasync)

Or just add it to your project with `npm i --save react-hooks-useasync`

# How to use

The package exposes a single method, `useAsync`, which takes 1-2 arguments and returns a tuple of three arguments:

```typescript
const [value, state, wrappedMethod] = useAsync(
  originalMethod,
  (defaultValue = undefined)
);
```

Thanks to TypeScript shenanigans, `wrappedMethod` will have the same named and typed parameters as `originalMethod` and `value` will have the return type of `originalMethod` (with `undefined` added if no `defaultValue` has been specified)

`state` is defined via an export enum `AsyncState`, with the four possible values `idle` (method has yet to be called), `pending` (method has been called but it hasn't resolved yet), `done` (method has finished with a result), or `error` (method has encountered an error, and the raw error is now in the `value` variable).

`useAsync` will detect when a caller unmounts, and will avoid attempting to update the state

# [A Code Sandbox example](https://codesandbox.io/s/use-async-u3eks)

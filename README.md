# Siren.js Client

[![Node Package](https://img.shields.io/npm/v/@siren-js/client)](https://npmjs.org/@siren-js/client)
[![Build Status](https://img.shields.io/github/workflow/status/siren-js/client/Build%20Package)](https://github.com/siren-js/client/actions/workflows/build.yaml)
[![Code Coverage](https://img.shields.io/codecov/c/github/siren-js/client)](https://codecov.io/gh/siren-js/client)
[![License](https://img.shields.io/github/license/siren-js/client)](LICENSE)
[![Contributing](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](CONTRIBUTING.md)

A cross-platform library that allows for easily communicating with [Siren]
servers. Built on top of the [core Siren.js library][core].

[siren]: https://github.com/kevinswiber/siren
[core]: https://github.com/siren-js/core

- [Installation](#installation)
- [Development Release](#development-release)
- [Getting Started](#getting-started)
- [HTTP Headers](#http-headers)
- [Following Links](#following-links)
- [Submitting Actions](#submitting-actions)
- [Contributing](#contributing)

## Installation

```text
npm install @siren-js/client
```

## Development Release

`@siren-js/client` is currently in the development phase (v0.x) while we work to
realize the best API for working with Siren in JavaScript. This means minor
version increments may not be backward compatible, but patch version increments
will.

In order to get to a production-ready release (v1+), we need users to try out
the library, find bugs, and give honest, constructive feedback on how we can
improve! See the [Contributing](#contributing) section below.

## Getting Started

Once you've [installed the package](#installation), import the client class,
create a new instance, and use the `fetch()` method to call the entry point of
a Siren API.

```js
import SirenClient from '@siren-js/client';

const client = new SirenClient();

let response = await client.fetch('http://api.example.com');
```

The `fetch()` method acts as a wrapper for the [Fetch API][fetch]. The value
returned from `fetch()` is a decorated [`Response`][response] object that adds a
`siren()` method for parsing JSON text as Siren.

[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[response]: https://developer.mozilla.org/en-US/docs/Web/API/Response

```js
let entity;
// optionally check Content-Type to avoid potential error
if (response.headers.get('Content-Type') === 'application/vnd.siren+json') {
  entity = await response.siren();
  //=> instanceof Entity from @siren-js/core
}
```

## HTTP Headers

The `headers` property lets you specify HTTP headers to include in each request.

[headers]: https://developer.mozilla.org/en-US/docs/Web/API/Headers

You can initialize this at runtime:

```js
new SirenClient({
  headers: {
    'Api-Key': 'abcdefghijklmnopqrstuvwxyz',
    Authorization: 'Bearer abc.efg.hij'
  }
});
```

Or you can modify the property via the [`Headers`][headers] interface:

```js
client.headers.set('Authorization', 'Bearer klm.nop.qrs');
```

By default, the `Accept` header is set to the following preference string:

```text
application/vnd.siren+json,application/json;q=0.9,*/*;q=0.8
```

This can of course be overwritten via either the options object or the property.
The default value is made available by the static constant
`SirenClient.DEFAULT_ACCEPT_PREFERENCE`.

## Following Links

The `follow()` method lets you follow [links][link].

[link]: https://github.com/kevinswiber/siren#links-1
[embedded-link]: https://github.com/kevinswiber/siren#embedded-link

```js
// look up item links
const [link] = entity.getLinksByRel('item');
// if an item link exists
if (link) {
  // follow it
  response = await client.follow(link);
}
```

You can also follow [embedded links][embedded-link].

```js
const [link] = entity.getEntitiesByRel('item');
if (link) {
  response = await client.follow(link);
}
```

## Submitting Actions

The `submit()` method will convert an [action] into and make an HTTP request
based on the `href`, `method`, and `type` (currently only
`application/x-www-form-urlencoded` is supported).

[action]: https://github.com/kevinswiber/siren#actions-1

```js
const action = entity.getActionByName('add-item');
// if the add-item action exists
if (action) {
  // populate its fields
  action.getFieldByName('productCode')?.value = 'abc123';
  action.getFieldByName('quantity')?.value = 42;
  // and submit it
  response = await client.submit(action);
}
```

The following field types are submitted according to our
[Siren extensions](https://github.com/siren-js/spec-extensions):

- [`checkbox`](https://github.com/siren-js/spec-extensions#checkbox-fields)
- [`file`](https://github.com/siren-js/spec-extensions#file-fields)
- [`radio`](https://github.com/siren-js/spec-extensions#radio-fields)
- [`select`](https://github.com/siren-js/spec-extensions#select-fields)
- [`textarea`](https://github.com/siren-js/spec-extensions#textarea-fields)

## Contributing

If you would like to contribute anything from a bug report to a code change, see
our [contribution guidelines](CONTRIBUTING.md).

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
- [Following Links](#following-links)
- [Submitting Actions](#submitting-actions)
  - [Customizing Field Serialization](#customizing-field-serialization)
- [Customizing HTTP Headers](#customizing-http-headers)
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

## Following Links

The `follow()` method lets you follow [links][link].

[link]: https://github.com/kevinswiber/siren#links-1

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

[embedded-link]: https://github.com/kevinswiber/siren#embedded-link

```js
const [link] = entity.getEntitiesByRel('item');
if (link) {
  response = await client.follow(link);
}
```

## Submitting Actions

The `submit()` method will convert an [action] into and make an HTTP request
based on the `href` and `method`. Fields are serialized based on the action's
`type`.

[action]: https://github.com/kevinswiber/siren#actions-1
[ext]: https://github.com/siren-js/spec-extensions#action-submission-algorithm

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

By default, actions are submitted according to our [Siren extensions][ext], but
this is [customizable](#customizing-field-serialization). Out of the box, the
client supports submitting an action whose `type` is
`application/x-www-form-urlencoded` (default), `multipart/form-data`, or
`text/plain`. Additionally, it supports the following field types:

- [`checkbox`](https://github.com/siren-js/spec-extensions#checkbox-fields)
- [`file`](https://github.com/siren-js/spec-extensions#file-fields)
- [`radio`](https://github.com/siren-js/spec-extensions#radio-fields)
- [`select`](https://github.com/siren-js/spec-extensions#select-fields)
- [`textarea`](https://github.com/siren-js/spec-extensions#textarea-fields)

### Customizing Field Serialization

The client lets you customize how fields are serialized for
[action submission](#submitting-actions) based on its `type`. There are two ways
to configure serializers: constructor initialization or the `serializers`
property.

For constructor initialization, pass an object to the constructor with a
`serializers` member. The value can be an object, an array of key-value pairs,
or a `Serializers` instance. Regardless of the specific data structure, keys are
media type strings and values are serializers, which are functions from `Action`
to [`BodyInit`][bodyinit].

[bodyinit]: https://fetch.spec.whatwg.org/#bodyinit-unions

Here's an example using an object:

```js
new SirenClient({
  serializers: {
    'application/json': (action) => {
      const fields = action.fields ?? [];
      const obj = fields.reduce((obj, field) => {
        obj[field.name] = field.value;
        return obj;
      }, {});
      return JSON.stringify(obj);
    }
  }
});
```

Alternatively, use the `serializers` property, which is a `Serializers`
instance:

```js
client.serializers.set('application/json', (action) => {
  /* ... */
});
```

The `Serializers` class is an extension of `Map` that only allows entries whose
keys are valid media type strings and values are functions.

## Customizing HTTP Headers

The client lets you customize HTTP headers to include in each request (e.g., an
API key or bearer token). There are two ways to configure headers: constructor
initialization or the `headers` property.

For constructor initialization, pass an object to the constructor with a
`headers` member whose value is anything you can pass to the
[`Headers`][headers] constructor.

[headers]: https://developer.mozilla.org/en-US/docs/Web/API/Headers

```js
new SirenClient({
  headers: {
    'Api-Key': 'abcdefghijklmnopqrstuvwxyz',
    Authorization: 'Bearer abc.efg.hij'
  }
});
```

Alternatively, use the `headers` property on the client to modify HTTP headers
using the `Headers` interface:

```js
client.headers.set('Authorization', 'Bearer klm.nop.qrs');
```

By default, an `Accept` header is included with the following preference string:

```text
application/vnd.siren+json,application/json;q=0.9,*/*;q=0.8
```

You can overwrite or remove this via the `headers` property, or you can
overwrite it by including your own `Accept` header in the constructor options.
The default value is made available by the static constant
`SirenClient.DEFAULT_ACCEPT_PREFERENCE`.

## Contributing

If you would like to contribute anything from a bug report to a code change, see
our [contribution guidelines](CONTRIBUTING.md).

# Siren.js Client

[![Node Package](https://img.shields.io/npm/v/@siren-js/client?style=flat-square)](https://npmjs.org/@siren-js/client)
[![Build Workflow](https://img.shields.io/github/actions/workflow/status/siren-js/client/build.yaml?style=flat-square)](https://github.com/siren-js/client/actions/workflows/build.yaml)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![License](https://img.shields.io/github/license/siren-js/client?style=flat-square)](LICENSE)
[![Contributing](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square)](https://github.com/siren-js/.github/blob/main/profile/CONTRIBUTING.md)

[Siren](https://github.com/kevinswiber/siren) API client library for JavaScript

This library handles much of the boilerplate, protocol-level details around interacting with a Siren API. Here are the things it can do:

- [x] Parse and validate Siren representations
- [x] Follow a `Link` (or any URL)
- [x] Submit an `Action`
  - [x] Customize `Field` validation and serialization
- [x] Resolve a `SubEntity`
- [x] Traverse an `Entity` via the [Visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern)
- [x] Crawl a Siren API

## Table of Contents <!-- omit in toc -->

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Development](#development)
- [API](#api)
- [Maintainer](#maintainer)
- [Contributing](#contributing)
- [License](#license)

## Background

<!-- TODO -->

## Install

```bash
npm install @siren-js/client
```

## Usage

```js
import { follow, parse, resolve } from '@siren-js/client';

// follow API entry point
let response = await follow('https://api.example.com/entry-point');
// parse the response as Siren
let entity = await parse(response);

// find the first 'item' sub-entity
const itemSubEntity = entity.entities.find((subEntity) => subEntity.rel.includes('item'));
if (itemSubEntity != null) {
  // resolve the sub-entity to a full entity
  entity = await resolve(itemSubEntity);
}

// find the first 'next' link
const nextLink = entity.links.find((link) => link.rel.includes('next'));
if (nextLink != null) {
  // follow the 'next' link, if present, and parse as a Siren entity
  entity = await follow(nextLink).then(parse);
}

// find the 'edit' action
const editAction = entity.getAction('edit');
if (editAction != null) {
  // find the 'quantity' field in the 'edit' action
  const quantityField = editAction.getField('quantity');
  if (quantityField != null) {
    // set the 'quantity' field value
    quantityField.value = 69;
  }
  // submit the action and parse the response as Siren
  response = await submit(editAction).then(parse);
}
```

## Development

```sh
# setup Node.js
$ nvm use

# test with Jest
$ npm test
# run tests in watch mode
$ npm run test:watch
# run tests with coverage
$ npm run test:cov

# compile TypeScript code
$ npm run compile

# lint with ESLint
$ npm run lint
# automatically fix lint issues where possible
$ npm run lint:fix

# format files with Prettier
$ npm run format
# check files for proper formatting
$ npm run format:check

# build the library (compile, lint, format check)
$ npm run build:lib

# generate docs with TypeDoc
$ npm run build:docs
```

## API

See our [docs](https://siren-js.github.io/client).

## Maintainer

[@dillonredding](https://github.com/dillonredding)

## Contributing

See our [contribution guidelines](https://github.com/siren-js/.github/blob/main/profile/CONTRIBUTING.md).

PRs accepted.

If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT](./LICENSE) &copy; 2021 Dillon Redding

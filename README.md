# Siren.js Client

[![Node Package](https://img.shields.io/npm/v/@siren-js/client?style=flat-square)](https://npmjs.org/@siren-js/client)
[![Build Workflow](https://img.shields.io/github/actions/workflow/status/siren-js/client/build.yaml?style=flat-square)]()
[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![License](https://img.shields.io/github/license/siren-js/client?style=flat-square)](LICENSE)
[![Contributing](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

[Siren](https://github.com/kevinswiber/siren) API client library for JavaScript

Siren is a very powerful hypermedia format that enables a server and its clients to be decoupled from one another. There is a lot of boilerplate, protocol-level details around interacting with a Siren API, which is where Siren.js client comes in. This library allows you to do the following:

- [x] Parse and validate Siren representations
- [x] Follow a `Link` (or any URL)
- [x] Submit an `Action`
- [ ] Traverse an `Entity` via the [Visitor pattern](https://en.wikipedia.org/wiki/Visitor_pattern)
- [ ] Crawl a Siren API

## Table of Contents <!-- omit in toc -->

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
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
import { follow, parse } from '@siren-js/client';

const response = await follow('https://api.example.com/entry-point');

// TODO
```

## API

See the [docs](./docs/modules.md) folder.

## Maintainer

[@dillonredding](https://github.com/dillonredding)

## Contributing

See our [contribution guidelines](./CONTRIBUTING.md).

PRs accepted.

If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

[MIT](./LICENSE) &copy; 2021 Dillon Redding

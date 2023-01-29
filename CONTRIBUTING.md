# Contribution Guidelines

Thank you for taking the time and consideration to contribute to [Siren.js](https://github.com/siren-js)!

This document outlines our guidelines for contributing to this repository, which is part of the Siren.js project. Following these guidelines helps communicate that you respect the time of the developers managing and developing this open source project. In return, they should reciprocate that respect in addressing your issue, assessing changes, and helping you finalize your pull requests. Check out the [Code of Conduct](CODE_OF_CONDUCT.md) to learn about our core values and norms.

If you have feedback or questions, your contribution has been sitting for a while, you need help, or would like to talk through a contribution, feel free to join the [Google Group](https://groups.google.com/g/sirenjs) or the [Slack](https://join.slack.com/t/sirenhypermedia/shared_invite/zt-vyhh52kw-pfohlw1UQ4uwR_Cf4D~RSA)!

> First time contributing to open source? You can learn how from this _free_ video series: [How to Contribute to an Open Source Project on GitHub](https://kcd.im/pull-request).

## Bugs and Feature Requests

If you find a bug or would like to request a new feature, be sure to check out the current list of [issues](https://github.com/siren-js/client/issues). If you can't find anything, feel free to [create a new one](https://github.com/siren-js/client/issues/new).

## Pull Requests

If you'd like to contribute a change, follow these steps:

1. If you aren't a collaborator or Siren.js member, fork the repository and clone your fork.
1. Create a branch.
1. Make and commit your changes (see [Development](#development)).
   - Be sure to update the [changelog](CHANGELOG.md).
   - If you're making code changes, be sure to write tests!
1. Push your changes to your fork.
1. If your build is passing, create a pull request.
1. Wait for a review and make changes as requested.
1. Get merged!

## Development

This section helps you get your development environment set up for making code changes.

First, you'll want to be sure [Node.js](https://nodejs.org) is installed. You can either download and install it directly from Node's website, or you can use a Node version manager (recommended for testing on multiple versions of Node). There's [nvm](https://github.com/nvm-sh/nvm) for Mac/Linux and [nvm-windows](https://github.com/coreybutler/nvm-windows) for Windows.

Next, `cd` into the directory of your cloned fork and run `npm install`.

Now you're ready to start coding!

When writing tests, name the file after the module being tested and append `.spec.ts`. The file should live next to the module it tests.

Here are the NPM scripts available in the project:

```sh
# format files with Prettier
$ npm run format
# check files for proper formatting
$ npm run format:check

# lint with ESLint
$ npm run lint
# automatically fix lint issues where possible
$ npm run lint:fix

# test with Jest
$ npm test
# run tests in watch mode
$ npm run test:watch
# run tests with coverage
$ npm run test:cov

# compile TypeScript code
$ npm run compile

# build (compile, lint, format check) the project
$ npm run build:lib

# generate docs
$ npm run build:docs
```

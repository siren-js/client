# Contribution Guidelines

Thank you for taking the time and consideration to contribute to [Siren.js]!

[siren.js]: https://github.com/siren-js

This document outlines our guidelines for contributing to this repository, which
is part of the Siren.js project. Following these guidelines helps communicate
that you respect the time of the developers managing and developing this open
source project. In return, they should reciprocate that respect in addressing
your issue, assessing changes, and helping you finalize your pull requests.
Check out the [Code of Conduct](CODE_OF_CONDUCT.md) to learn about our core
values and norms.

If you have feedback or questions, your contribution has been sitting for a
while, you need help, or would like to talk through a contribution, feel free to
join the [Google Group][gg]!

[gg]: https://groups.google.com/g/sirenjs

> First time contributing to open source? You can learn how from this _free_
> video series: [How to Contribute to an Open Source Project on GitHub][course].

[course]: https://kcd.im/pull-request

## Bugs and Feature Requests

If you find a bug or would like to request a new feature, be sure to check out
the current list of [issues]. If you can't find anything, feel free to
[create a new one][create-issue].

[issues]: https://github.com/siren-js/client/issues
[create-issue]: https://github.com/siren-js/client/issues/new

## Pull Requests

If you'd like to contribute a change, follow these steps:

1. Fork the repository.
1. Clone your fork.
1. Create a branch.
1. Make and commit your changes (see [Development](#development)).
   - Be sure to update the [changelog](CHANGELOG.md).
   - If you're making code changes, be sure to write tests!
1. Push your changes to your fork.
1. If your build is passing, create a pull request.
1. Wait for a review and make changes as requested.
1. Get merged!

## Development

This section helps you get your development environment set up for making code
changes.

First, you'll want to be sure [Node.js] is installed. You can either download
and install it directly from Node's website, or you can use a Node version
manager (recommended for testing on multiple versions of Node). There's [nvm]
for Mac/Linux and [nvm-windows] for Windows.

[node.js]: https://nodejs.org
[nvm]: https://github.com/nvm-sh/nvm
[nvm-windows]: https://github.com/coreybutler/nvm-windows

Next, `cd` into the directory of your cloned fork and run `npm install`.

Now you're ready to start coding! All code lives in the `src` directory, and
tests for a module live in the `__test__` directory next to it. Here are
some example commands you can run at the root of the project:

```sh
# format files with Prettier
$ npm run format

# lint with ESLint
$ npm run lint
# automatically fix lint issues where possible
$ npm run lint:fix

# test with Jest
# run tests in Node
$ npm run test:node
# run tests in the browser
$ npm run test:jsdom
# run tests in both environments
$ npm test
# run tests as you make changes
$ npm run test:node -- --watch

# compile TypeScript
$ npm run compile

# build (compile, lint, test) the project
$ npm run build
```

This project uses [SemVer](https://semver.org/). When making code changes, be
sure to increment the version accordingly with the
[`npm version` command][npm-version]. We recommend using the
`--no-git-tag-version` option to avoid potential issues.

[npm-version]: https://docs.npmjs.com/cli/v7/commands/npm-version

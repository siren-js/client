# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog][kac], and this project adheres to
[Semantic Versioning][semver].

[kac]: https://keepachangelog.com/en/1.0.0
[semver]: https://semver.org/spec/v2.0.0.html

## Unreleased

### Added

- Defaulter serializer for `multipart/form-data` actions ([#8])

[#8]: https://github.com/siren-js/client/issues/8

## 0.4.0 - 2021-12-05

### Added

- Support for custom serializers
- Default serializer for `text/plain` actions

### Changed

- Upgraded `@siren-js/core` to v0.3.2
- Aligned newline normalization with HTML's algorithm for
  [converting an entry list to a list of name-value pairs][el2nvp], which
  normalizes newlines in fields' `name`s and values during action submission.

[el2nvp]: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#converting-an-entry-list-to-a-list-of-name-value-pairs

## 0.3.1 - 2021-06-12

### Changed

- Using `@web-std/file` in place of `web-file-polyfill` (fixes [#6])

[#6]: https://github.com/siren-js/client/issues/6

## 0.3.0 - 2021-06-02

### Added

- The following field types are now supported in action submission:
  - [`file`](https://github.com/siren-js/spec-extensions#file-fields)
  - [`select`](https://github.com/siren-js/spec-extensions#select-fields)
  - [`textarea`](https://github.com/siren-js/spec-extensions#textarea-fields)

### Changed

- When creating entries for action submission, fields' `name` and `value`
  properties are [converted] according to the HTML standard.

[converted]: https://infra.spec.whatwg.org/#javascript-string-convert

## 0.2.1 - 2021-05-19

### Fixed

- When submitting an action, non-`checkbox` and non-`radio` fields with no
  `value` property are submitted with an empty string value, rather than
  `"undefined"` ([#3]).

[#3]: https://github.com/siren-js/client/issues/3

## 0.2.0 - 2021-05-18

### Added

- The client class now has a `headers` property for customizing HTTP headers
  sent in each request. The property can be initialized via the constructor's
  options object (see the [README](README.md#http-headers)).

## 0.1.0 - 2021-05-03

### Added

- Client class for communicating with a Siren server
  - `fetch()` method for hitting API entry point
  - `follow()` method for following links (including embedded links)
  - `submit()` method for submitting actions; currently, only actions whose
    `type` is `"application/x-www-form-urlencoded"` are supported.
- Client `Response` wrapper for parsing Siren responses

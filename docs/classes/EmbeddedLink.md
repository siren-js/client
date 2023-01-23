[@siren-js/client](../README.md) / [Exports](../modules.md) / EmbeddedLink

# Class: EmbeddedLink

Represent a sub-entity as a link

## Indexable

▪ [extensions: `string`]: `unknown`

## Table of contents

### Constructors

- [constructor](EmbeddedLink.md#constructor)

### Properties

- [class](EmbeddedLink.md#class)
- [href](EmbeddedLink.md#href)
- [rel](EmbeddedLink.md#rel)
- [title](EmbeddedLink.md#title)
- [type](EmbeddedLink.md#type)

## Constructors

### constructor

• **new EmbeddedLink**()

## Properties

### class

• **class**: `string`[] = `[]`

List of strings describing the nature of the `Link` based on the current representation. Possible values are
implementation-dependent and should be documented.

#### Defined in

[src/models/embedded-link.ts:16](https://github.com/siren-js/client/blob/3170d58/src/models/embedded-link.ts#L16)

___

### href

• **href**: `string`

URI of the linked resource.

#### Defined in

[src/models/embedded-link.ts:22](https://github.com/siren-js/client/blob/3170d58/src/models/embedded-link.ts#L22)

___

### rel

• **rel**: `string`[]

List of strings describing the relationship of the `Link` to its `Entity`, per [RFC 8288](https://tools.ietf.org/html/rfc8288).

#### Defined in

[src/models/embedded-link.ts:30](https://github.com/siren-js/client/blob/3170d58/src/models/embedded-link.ts#L30)

___

### title

• `Optional` **title**: `string`

Text describing the nature of the link.

#### Defined in

[src/models/embedded-link.ts:37](https://github.com/siren-js/client/blob/3170d58/src/models/embedded-link.ts#L37)

___

### type

• `Optional` **type**: `string`

Hint indicating what the media type of the result of dereferencing the `Link` should be, per [RFC 8288](https://tools.ietf.org/html/rfc8288#section-3.4.1).

#### Defined in

[src/models/embedded-link.ts:44](https://github.com/siren-js/client/blob/3170d58/src/models/embedded-link.ts#L44)

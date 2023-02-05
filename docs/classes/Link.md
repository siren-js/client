[@siren-js/client](../README.md) / [Exports](../modules.md) / Link

# Class: Link

Represents a URI-addressable resource

## Indexable

▪ [extension: `string`]: `unknown`

## Table of contents

### Constructors

- [constructor](Link.md#constructor)

### Properties

- [class](Link.md#class)
- [href](Link.md#href)
- [rel](Link.md#rel)
- [title](Link.md#title)
- [type](Link.md#type)

## Constructors

### constructor

• **new Link**()

## Properties

### class

• **class**: `string`[] = `[]`

List of strings describing the nature of the `Link` based on the current representation. Possible values are
implementation-dependent and should be documented.

#### Defined in

[src/models/link.ts:16](https://github.com/siren-js/client/blob/647f8ee/src/models/link.ts#L16)

___

### href

• **href**: `string`

URI of the linked resource.

#### Defined in

[src/models/link.ts:22](https://github.com/siren-js/client/blob/647f8ee/src/models/link.ts#L22)

___

### rel

• **rel**: `string`[]

List of strings describing the relationship of the `Link` to its `Entity`, per [RFC 8288](https://tools.ietf.org/html/rfc8288).

#### Defined in

[src/models/link.ts:29](https://github.com/siren-js/client/blob/647f8ee/src/models/link.ts#L29)

___

### title

• `Optional` **title**: `string`

Text describing the nature of the link.

#### Defined in

[src/models/link.ts:36](https://github.com/siren-js/client/blob/647f8ee/src/models/link.ts#L36)

___

### type

• `Optional` **type**: `string`

Hint indicating what the media type of the result of dereferencing the `Link` should be, per [RFC 8288](https://tools.ietf.org/html/rfc8288#section-3.4.1).

#### Defined in

[src/models/link.ts:43](https://github.com/siren-js/client/blob/647f8ee/src/models/link.ts#L43)

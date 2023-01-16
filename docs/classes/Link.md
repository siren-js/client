[@siren-js/client](../README.md) / [Exports](../modules.md) / Link

# Class: Link

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

• `Optional` **class**: `string`[]

List of strings describing the nature of the `Link` based on the current representation. Possible values are
implementation-dependent and should be documented.

#### Defined in

[models/link.ts:13](https://github.com/siren-js/client/blob/f34d34d/src/models/link.ts#L13)

___

### href

• **href**: `string`

URI of the linked resource.

#### Defined in

[models/link.ts:19](https://github.com/siren-js/client/blob/f34d34d/src/models/link.ts#L19)

___

### rel

• **rel**: `string`[]

List of strings describing the relationship of the `Link` to its `Entity`, per [RFC 8288](https://tools.ietf.org/html/rfc8288).

#### Defined in

[models/link.ts:26](https://github.com/siren-js/client/blob/f34d34d/src/models/link.ts#L26)

___

### title

• `Optional` **title**: `string`

Text describing the nature of the link.

#### Defined in

[models/link.ts:33](https://github.com/siren-js/client/blob/f34d34d/src/models/link.ts#L33)

___

### type

• `Optional` **type**: `string`

Hint indicating what the media type of the result of dereferencing the `Link` should be, per [RFC 8288](https://tools.ietf.org/html/rfc8288#section-3.4.1).

#### Defined in

[models/link.ts:40](https://github.com/siren-js/client/blob/f34d34d/src/models/link.ts#L40)

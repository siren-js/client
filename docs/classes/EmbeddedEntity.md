[@siren-js/client](../README.md) / [Exports](../modules.md) / EmbeddedEntity

# Class: EmbeddedEntity<T\>

Represents an embedded URI-addressable resource

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` = `object` |

## Indexable

▪ [extensions: `string`]: `unknown`

## Table of contents

### Constructors

- [constructor](EmbeddedEntity.md#constructor)

### Properties

- [actions](EmbeddedEntity.md#actions)
- [class](EmbeddedEntity.md#class)
- [entities](EmbeddedEntity.md#entities)
- [links](EmbeddedEntity.md#links)
- [properties](EmbeddedEntity.md#properties)
- [rel](EmbeddedEntity.md#rel)
- [title](EmbeddedEntity.md#title)

### Methods

- [getAction](EmbeddedEntity.md#getaction)

## Constructors

### constructor

• **new EmbeddedEntity**<`T`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` = `object` |

## Properties

### actions

• **actions**: [`Action`](Action.md)[] = `[]`

Available behavior exposed by the `EmbeddedEntity`

#### Defined in

[src/models/embedded-entity.ts:20](https://github.com/siren-js/client/blob/647f8ee/src/models/embedded-entity.ts#L20)

___

### class

• **class**: `string`[] = `[]`

List of strings describing the nature of the `EmbeddedEntity` based on the current representation. Possible values
are implementation-dependent and should be documented.

#### Defined in

[src/models/embedded-entity.ts:29](https://github.com/siren-js/client/blob/647f8ee/src/models/embedded-entity.ts#L29)

___

### entities

• **entities**: [`SubEntity`](../modules.md#subentity)[] = `[]`

Related entities represented as embedded links or representations

#### Defined in

[src/models/embedded-entity.ts:38](https://github.com/siren-js/client/blob/647f8ee/src/models/embedded-entity.ts#L38)

___

### links

• **links**: [`Link`](Link.md)[] = `[]`

Navigation links that communicate ways to navigate outside the entity graph

#### Defined in

[src/models/embedded-entity.ts:47](https://github.com/siren-js/client/blob/647f8ee/src/models/embedded-entity.ts#L47)

___

### properties

• `Optional` **properties**: `T`

Key-value pairs describing the state of the `Entity`

#### Defined in

[src/models/embedded-entity.ts:54](https://github.com/siren-js/client/blob/647f8ee/src/models/embedded-entity.ts#L54)

___

### rel

• **rel**: `string`[]

List of strings describing the relationship of the `EmbeddedEntity` to its parent, per [RFC 8288](https://tools.ietf.org/html/rfc8288).

#### Defined in

[src/models/embedded-entity.ts:61](https://github.com/siren-js/client/blob/647f8ee/src/models/embedded-entity.ts#L61)

___

### title

• `Optional` **title**: `string`

Descriptive text about the `Entity`

#### Defined in

[src/models/embedded-entity.ts:68](https://github.com/siren-js/client/blob/647f8ee/src/models/embedded-entity.ts#L68)

## Methods

### getAction

▸ **getAction**(`name`): `undefined` \| [`Action`](Action.md)

Returns the `Action` in `actions` with the given `name`, if it exists. Otherwise, returns `undefined`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`undefined` \| [`Action`](Action.md)

#### Defined in

[src/models/embedded-entity.ts:75](https://github.com/siren-js/client/blob/647f8ee/src/models/embedded-entity.ts#L75)

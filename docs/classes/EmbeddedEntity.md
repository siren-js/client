[@siren-js/client](../README.md) / [Exports](../modules.md) / EmbeddedEntity

# Class: EmbeddedEntity<T\>

Represents an embedded URI-addressable resource

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `UnknownRecord` = `UnknownRecord` |

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

## Constructors

### constructor

• **new EmbeddedEntity**<`T`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `UnknownRecord` = `UnknownRecord` |

## Properties

### actions

• **actions**: [`Action`](Action.md)[] = `[]`

Available behavior exposed by the `EmbeddedEntity`

#### Defined in

[src/models/embedded-entity.ts:21](https://github.com/siren-js/client/blob/3170d58/src/models/embedded-entity.ts#L21)

___

### class

• **class**: `string`[] = `[]`

List of strings describing the nature of the `EmbeddedEntity` based on the current representation. Possible values
are implementation-dependent and should be documented.

#### Defined in

[src/models/embedded-entity.ts:30](https://github.com/siren-js/client/blob/3170d58/src/models/embedded-entity.ts#L30)

___

### entities

• **entities**: [`SubEntity`](../modules.md#subentity)[] = `[]`

Related entities represented as embedded links or representations

#### Defined in

[src/models/embedded-entity.ts:39](https://github.com/siren-js/client/blob/3170d58/src/models/embedded-entity.ts#L39)

___

### links

• **links**: [`Link`](Link.md)[] = `[]`

Navigation links that communicate ways to navigate outside the entity graph

#### Defined in

[src/models/embedded-entity.ts:48](https://github.com/siren-js/client/blob/3170d58/src/models/embedded-entity.ts#L48)

___

### properties

• `Optional` **properties**: `T`

Key-value pairs describing the state of the `Entity`

#### Defined in

[src/models/embedded-entity.ts:55](https://github.com/siren-js/client/blob/3170d58/src/models/embedded-entity.ts#L55)

___

### rel

• **rel**: `string`[]

List of strings describing the relationship of the `EmbeddedEntity` to its parent, per [RFC 8288](https://tools.ietf.org/html/rfc8288).

#### Defined in

[src/models/embedded-entity.ts:62](https://github.com/siren-js/client/blob/3170d58/src/models/embedded-entity.ts#L62)

___

### title

• `Optional` **title**: `string`

Descriptive text about the `Entity`

#### Defined in

[src/models/embedded-entity.ts:69](https://github.com/siren-js/client/blob/3170d58/src/models/embedded-entity.ts#L69)

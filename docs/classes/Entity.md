[@siren-js/client](../README.md) / [Exports](../modules.md) / Entity

# Class: Entity<T\>

Represents a URI-addressable resource

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends `object` = `UnknownRecord` | Type of the `properties` property |

## Indexable

▪ [extension: `string`]: `unknown`

## Table of contents

### Constructors

- [constructor](Entity.md#constructor)

### Properties

- [actions](Entity.md#actions)
- [class](Entity.md#class)
- [entities](Entity.md#entities)
- [links](Entity.md#links)
- [properties](Entity.md#properties)
- [title](Entity.md#title)

## Constructors

### constructor

• **new Entity**<`T`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` = `UnknownRecord` |

## Properties

### actions

• **actions**: [`Action`](Action.md)[] = `[]`

Available behavior exposed by the `Entity`

#### Defined in

[src/models/entity.ts:22](https://github.com/siren-js/client/blob/3170d58/src/models/entity.ts#L22)

___

### class

• **class**: `string`[] = `[]`

List of strings describing the nature of the `Entity` based on the current representation. Possible values are
implementation-dependent and should be documented.

#### Defined in

[src/models/entity.ts:31](https://github.com/siren-js/client/blob/3170d58/src/models/entity.ts#L31)

___

### entities

• **entities**: [`SubEntity`](../modules.md#subentity)[] = `[]`

Related entities represented as embedded links or representations

#### Defined in

[src/models/entity.ts:40](https://github.com/siren-js/client/blob/3170d58/src/models/entity.ts#L40)

___

### links

• **links**: [`Link`](Link.md)[] = `[]`

Navigation links that communicate ways to navigate outside the entity graph

#### Defined in

[src/models/entity.ts:49](https://github.com/siren-js/client/blob/3170d58/src/models/entity.ts#L49)

___

### properties

• `Optional` **properties**: `T`

Key-value pairs describing the state of the `Entity`

#### Defined in

[src/models/entity.ts:56](https://github.com/siren-js/client/blob/3170d58/src/models/entity.ts#L56)

___

### title

• `Optional` **title**: `string`

Descriptive text about the `Entity`

#### Defined in

[src/models/entity.ts:63](https://github.com/siren-js/client/blob/3170d58/src/models/entity.ts#L63)

[@siren-js/client](../README.md) / [Exports](../modules.md) / Entity

# Class: Entity<T\>

Represents a URI-addressable resource

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends `object` = `object` | Type of the `properties` property |

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

### Methods

- [getAction](Entity.md#getaction)

## Constructors

### constructor

• **new Entity**<`T`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `object` = `object` |

## Properties

### actions

• **actions**: [`Action`](Action.md)[] = `[]`

Available behavior exposed by the `Entity`

#### Defined in

[src/models/entity.ts:21](https://github.com/siren-js/client/blob/eb240c3/src/models/entity.ts#L21)

___

### class

• **class**: `string`[] = `[]`

List of strings describing the nature of the `Entity` based on the current representation. Possible values are
implementation-dependent and should be documented.

#### Defined in

[src/models/entity.ts:30](https://github.com/siren-js/client/blob/eb240c3/src/models/entity.ts#L30)

___

### entities

• **entities**: [`SubEntity`](../modules.md#subentity)[] = `[]`

Related entities represented as embedded links or representations

#### Defined in

[src/models/entity.ts:39](https://github.com/siren-js/client/blob/eb240c3/src/models/entity.ts#L39)

___

### links

• **links**: [`Link`](Link.md)[] = `[]`

Navigation links that communicate ways to navigate outside the entity graph

#### Defined in

[src/models/entity.ts:48](https://github.com/siren-js/client/blob/eb240c3/src/models/entity.ts#L48)

___

### properties

• `Optional` **properties**: `T`

Key-value pairs describing the state of the `Entity`

#### Defined in

[src/models/entity.ts:55](https://github.com/siren-js/client/blob/eb240c3/src/models/entity.ts#L55)

___

### title

• `Optional` **title**: `string`

Descriptive text about the `Entity`

#### Defined in

[src/models/entity.ts:62](https://github.com/siren-js/client/blob/eb240c3/src/models/entity.ts#L62)

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

[src/models/entity.ts:69](https://github.com/siren-js/client/blob/eb240c3/src/models/entity.ts#L69)

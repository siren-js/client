[@siren-js/client](../README.md) / [Exports](../modules.md) / Action

# Class: Action

Represents available behavior exposed by an `Entity`.

## Indexable

▪ [extensions: `string`]: `unknown`

## Table of contents

### Constructors

- [constructor](Action.md#constructor)

### Properties

- [class](Action.md#class)
- [fields](Action.md#fields)
- [href](Action.md#href)
- [method](Action.md#method)
- [name](Action.md#name)
- [title](Action.md#title)
- [type](Action.md#type)

### Methods

- [getField](Action.md#getfield)

## Constructors

### constructor

• **new Action**()

## Properties

### class

• **class**: `string`[] = `[]`

List of strings describing the nature of the `Action` based on the current representation. Possible values are
implementation-dependent and should be documented.

#### Defined in

[src/models/action.ts:18](https://github.com/siren-js/client/blob/f21a3b1/src/models/action.ts#L18)

___

### fields

• **fields**: [`Field`](Field.md)<`unknown`\>[] = `[]`

Input controls of the `Action`.

#### Defined in

[src/models/action.ts:28](https://github.com/siren-js/client/blob/f21a3b1/src/models/action.ts#L28)

___

### href

• **href**: `string`

URI of the action

#### Defined in

[src/models/action.ts:34](https://github.com/siren-js/client/blob/f21a3b1/src/models/action.ts#L34)

___

### method

• **method**: `string` = `'GET'`

Protocol method used when submitting the `Action`. When missing, the default is assumed to be `'GET'`.

#### Defined in

[src/models/action.ts:41](https://github.com/siren-js/client/blob/f21a3b1/src/models/action.ts#L41)

___

### name

• **name**: `string`

Name identifying the action to be performed. Must be unique within an `Entity`'s `actions`.

#### Defined in

[src/models/action.ts:47](https://github.com/siren-js/client/blob/f21a3b1/src/models/action.ts#L47)

___

### title

• `Optional` **title**: `string`

Descriptive text about the `Action`.

#### Defined in

[src/models/action.ts:54](https://github.com/siren-js/client/blob/f21a3b1/src/models/action.ts#L54)

___

### type

• **type**: `string` = `'application/x-www-form-urlencoded'`

Encoding type indicating how `fields` are serialized when submitting the `Action`. When missing, the default is
assumed to be `'application/x-www-form-urlencoded'`.

#### Defined in

[src/models/action.ts:62](https://github.com/siren-js/client/blob/f21a3b1/src/models/action.ts#L62)

## Methods

### getField

▸ **getField**(`name`): `undefined` \| [`Field`](Field.md)<`unknown`\>

Returns the `Field` in `fields` with the given `name`, if it exists. Otherwise, returns `undefined`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`undefined` \| [`Field`](Field.md)<`unknown`\>

#### Defined in

[src/models/action.ts:69](https://github.com/siren-js/client/blob/f21a3b1/src/models/action.ts#L69)

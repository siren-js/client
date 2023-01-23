[@siren-js/client](../README.md) / [Exports](../modules.md) / Field

# Class: Field<T\>

Represents an input control inside an `Action`. Serialization of a `Field` depends on its `type` and its
corresponding `Action`'s `type`.

## Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | `unknown` | Type of the `value` property. |

## Indexable

▪ [extension: `string`]: `unknown`

## Table of contents

### Constructors

- [constructor](Field.md#constructor)

### Properties

- [class](Field.md#class)
- [name](Field.md#name)
- [title](Field.md#title)
- [type](Field.md#type)
- [value](Field.md#value)

## Constructors

### constructor

• **new Field**<`T`\>()

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

## Properties

### class

• **class**: `string`[] = `[]`

List of strings describing the nature of the `Field` based on the current representation. Possible values are
implementation-dependent and should be documented.

#### Defined in

[src/models/field.ts:16](https://github.com/siren-js/client/blob/3170d58/src/models/field.ts#L16)

___

### name

• **name**: `string`

Name describing the control. Must be unique within an `Action`.

#### Defined in

[src/models/field.ts:22](https://github.com/siren-js/client/blob/3170d58/src/models/field.ts#L22)

___

### title

• `Optional` **title**: `string`

Textual annotation of a field. Clients may use this as a label.

#### Defined in

[src/models/field.ts:29](https://github.com/siren-js/client/blob/3170d58/src/models/field.ts#L29)

___

### type

• **type**: `string` = `'text'`

Input type of the field. May include any of the [input types from HTML](https://html.spec.whatwg.org/multipage/input.html#attr-input-type).
When missing, the default is assumed to be `text`.

#### Defined in

[src/models/field.ts:37](https://github.com/siren-js/client/blob/3170d58/src/models/field.ts#L37)

___

### value

• `Optional` **value**: `T`

Value assigned to the `Field`.

#### Defined in

[src/models/field.ts:43](https://github.com/siren-js/client/blob/3170d58/src/models/field.ts#L43)

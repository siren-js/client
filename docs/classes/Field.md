[@siren-js/client](../README.md) / [Exports](../modules.md) / Field

# Class: Field<T\>

Represents an input control inside an `Action`. Serialization of a `Field` depends on its `type` and its
corresponding `Action`'s `type`.

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `unknown` |

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

• `Optional` **class**: `string`[]

List of strings describing the nature of the `Field` based on the current representation. Possible values are
implementation-dependent and should be documented.

#### Defined in

[models/field.ts:15](https://github.com/siren-js/client/blob/728c0fb/src/models/field.ts#L15)

___

### name

• **name**: `string`

Name describing the control. Must be unique within an `Action`.

#### Defined in

[models/field.ts:21](https://github.com/siren-js/client/blob/728c0fb/src/models/field.ts#L21)

___

### title

• `Optional` **title**: `string`

Textual annotation of a field. Clients may use this as a label.

#### Defined in

[models/field.ts:28](https://github.com/siren-js/client/blob/728c0fb/src/models/field.ts#L28)

___

### type

• `Optional` **type**: `string` = `'text'`

Input type of the field. May include any of the [input types from HTML](https://html.spec.whatwg.org/multipage/input.html#attr-input-type).
When missing, the default is assumed to be `text`.

#### Defined in

[models/field.ts:36](https://github.com/siren-js/client/blob/728c0fb/src/models/field.ts#L36)

___

### value

• `Optional` **value**: `T`

Value assigned to the `Field`.

#### Defined in

[models/field.ts:42](https://github.com/siren-js/client/blob/728c0fb/src/models/field.ts#L42)

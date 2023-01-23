[@siren-js/client](../README.md) / [Exports](../modules.md) / UnsupportedSerializerTypeError

# Class: UnsupportedSerializerTypeError

## Hierarchy

- `Error`

  ↳ **`UnsupportedSerializerTypeError`**

## Table of contents

### Constructors

- [constructor](UnsupportedSerializerTypeError.md#constructor)

### Properties

- [message](UnsupportedSerializerTypeError.md#message)
- [name](UnsupportedSerializerTypeError.md#name)
- [stack](UnsupportedSerializerTypeError.md#stack)
- [prepareStackTrace](UnsupportedSerializerTypeError.md#preparestacktrace)
- [stackTraceLimit](UnsupportedSerializerTypeError.md#stacktracelimit)

### Methods

- [captureStackTrace](UnsupportedSerializerTypeError.md#capturestacktrace)

## Constructors

### constructor

• **new UnsupportedSerializerTypeError**(`type`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |

#### Overrides

Error.constructor

#### Defined in

src/serialize/unsupported-serializer-type-error.ts:2

## Properties

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1054

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1053

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1055

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4

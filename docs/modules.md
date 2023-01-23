[@siren-js/client](README.md) / Exports

# @siren-js/client

## Table of contents

### Classes

- [Action](classes/Action.md)
- [EmbeddedEntity](classes/EmbeddedEntity.md)
- [EmbeddedLink](classes/EmbeddedLink.md)
- [Entity](classes/Entity.md)
- [Field](classes/Field.md)
- [Link](classes/Link.md)
- [UnsupportedSerializerTypeError](classes/UnsupportedSerializerTypeError.md)

### Interfaces

- [Hyperlink](interfaces/Hyperlink.md)
- [Serialization](interfaces/Serialization.md)
- [SubmitOptions](interfaces/SubmitOptions.md)

### Type Aliases

- [Parsable](modules.md#parsable)
- [Serializer](modules.md#serializer)
- [SubEntity](modules.md#subentity)
- [Target](modules.md#target)

### Functions

- [follow](modules.md#follow)
- [parse](modules.md#parse)
- [submit](modules.md#submit)
- [transformSubEntities](modules.md#transformsubentities)

## Type Aliases

### Parsable

Ƭ **Parsable**: `string` \| `UnknownRecord` \| `Response`

#### Defined in

[src/parse.ts:8](https://github.com/siren-js/client/blob/3170d58/src/parse.ts#L8)

___

### Serializer

Ƭ **Serializer**: (`type`: `string`, `fields`: [`Field`](classes/Field.md)[]) => `Promise`<[`Serialization`](interfaces/Serialization.md)\>

#### Type declaration

▸ (`type`, `fields`): `Promise`<[`Serialization`](interfaces/Serialization.md)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `fields` | [`Field`](classes/Field.md)[] |

##### Returns

`Promise`<[`Serialization`](interfaces/Serialization.md)\>

#### Defined in

src/serialize/serializer.ts:4

___

### SubEntity

Ƭ **SubEntity**: [`EmbeddedEntity`](classes/EmbeddedEntity.md) \| [`EmbeddedLink`](classes/EmbeddedLink.md)

#### Defined in

[src/models/sub-entity.ts:7](https://github.com/siren-js/client/blob/3170d58/src/models/sub-entity.ts#L7)

___

### Target

Ƭ **Target**: [`Hyperlink`](interfaces/Hyperlink.md) \| `RequestInfo`

#### Defined in

[src/follow.ts:11](https://github.com/siren-js/client/blob/3170d58/src/follow.ts#L11)

## Functions

### follow

▸ **follow**(`target`, `init?`): `Promise`<`Response`\>

Follows `target` by making an HTTP `GET` request. `target` can be a `RequestInfo` object or a `Hyperlink` object.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | [`Target`](modules.md#target) | request target |
| `init?` | `RequestInit` | optional HTTP request metadata |

#### Returns

`Promise`<`Response`\>

HTTP response of following `target`

#### Defined in

[src/follow.ts:19](https://github.com/siren-js/client/blob/3170d58/src/follow.ts#L19)

___

### parse

▸ **parse**<`T`\>(`value`): `Promise`<[`Entity`](classes/Entity.md)<`T`\>\>

Parses `value` as an [Entity](classes/Entity.md)

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends `object` = `UnknownRecord` | type of `Entity.properties` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | [`Parsable`](modules.md#parsable) |

#### Returns

`Promise`<[`Entity`](classes/Entity.md)<`T`\>\>

#### Defined in

[src/parse.ts:14](https://github.com/siren-js/client/blob/3170d58/src/parse.ts#L14)

___

### submit

▸ **submit**(`action`, `options?`): `Promise`<`Response`\>

Submits the given `action` by making an HTTP request according to `action`'s `method`, `href`, `fields`, and `type.
@param action Siren `Action` to submit
@param options Submission configuration
@returns `Promise` that fulfills with an HTTP `Response` object

#### Parameters

| Name | Type |
| :------ | :------ |
| `action` | [`Action`](classes/Action.md) |
| `options` | [`SubmitOptions`](interfaces/SubmitOptions.md) |

#### Returns

`Promise`<`Response`\>

#### Defined in

src/submit.ts:25

___

### transformSubEntities

▸ **transformSubEntities**(`subEntities`): [`SubEntity`](modules.md#subentity)[] \| `unknown`

#### Parameters

| Name | Type |
| :------ | :------ |
| `subEntities` | `unknown` |

#### Returns

[`SubEntity`](modules.md#subentity)[] \| `unknown`

#### Defined in

[src/models/sub-entity.ts:11](https://github.com/siren-js/client/blob/3170d58/src/models/sub-entity.ts#L11)

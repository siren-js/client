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

### Interfaces

- [Hyperlink](interfaces/Hyperlink.md)

### Type Aliases

- [Parsable](modules.md#parsable)
- [SubEntity](modules.md#subentity)
- [Target](modules.md#target)

### Functions

- [follow](modules.md#follow)
- [parse](modules.md#parse)

## Type Aliases

### Parsable

Ƭ **Parsable**: `string` \| `UnknownRecord` \| `Response`

#### Defined in

parse.ts:8

___

### SubEntity

Ƭ **SubEntity**: [`EmbeddedEntity`](classes/EmbeddedEntity.md) \| [`EmbeddedLink`](classes/EmbeddedLink.md)

#### Defined in

[models/sub-entity.ts:7](https://github.com/siren-js/client/blob/f34d34d/src/models/sub-entity.ts#L7)

___

### Target

Ƭ **Target**: [`Hyperlink`](interfaces/Hyperlink.md) \| `RequestInfo`

#### Defined in

[follow.ts:11](https://github.com/siren-js/client/blob/f34d34d/src/follow.ts#L11)

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

[follow.ts:19](https://github.com/siren-js/client/blob/f34d34d/src/follow.ts#L19)

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

parse.ts:14

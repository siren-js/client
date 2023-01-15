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

- [Target](modules.md#target)

### Functions

- [follow](modules.md#follow)

## Type Aliases

### Target

Ƭ **Target**: [`Hyperlink`](interfaces/Hyperlink.md) \| `RequestInfo`

#### Defined in

[follow.ts:11](https://github.com/siren-js/client/blob/728c0fb/src/follow.ts#L11)

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

[follow.ts:19](https://github.com/siren-js/client/blob/728c0fb/src/follow.ts#L19)

import { Action } from '@siren-js/core';
import Serialization from './serialization';

export type Serializer = (action: Action) => BodyInit | Serialization | Promise<BodyInit | Serialization>;

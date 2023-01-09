import { Action } from '../models/action';
import Serialization from './serialization';

export type Serializer = (action: Action) => BodyInit | Serialization | Promise<BodyInit | Serialization>;

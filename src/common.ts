import { Action } from './models/action';

export type ActionLike = Pick<Action, 'href' | 'fields' | 'method' | 'type'>;

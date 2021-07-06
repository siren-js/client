import { Action } from '@siren-js/core';

export type ActionLike = Pick<Action, 'href' | 'fields' | 'method' | 'type'>;

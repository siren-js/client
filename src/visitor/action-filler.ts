import { Field } from '../models';
import { DefaultSirenElementVisitor } from './default-siren-element-visitor';

/**
 * Fills out the `fields` in an `Action`
 *
 * @example
 * const fooField = new Field();
 * fooField.name = 'bar';
 *
 * const bazField = new Field();
 * bazField.name = 'baz';
 *
 * const action = new Action();
 * action.fields = [fooField, bazField];
 *
 * const filler = new ActionFiller({ foo: 'bar', baz: 42 });
 * action.accept(filler);
 *
 * fooField.value; //=> 'bar'
 * bazField.value; //=> 42
 */
export class ActionFiller extends DefaultSirenElementVisitor {
  constructor(public values: Record<string, unknown>) {
    super();
  }

  /**
   * Populates `field` with the value in {@linkcode values} associated with the field's `name`
   */
  visitField(field: Field): void {
    if (this.values[field.name]) {
      field.value = this.values[field.name];
    }
  }
}

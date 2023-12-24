/** Base class for representing the result of performing validation */
export abstract class ValidationResult {}

/** Represents successful validation */
export class PositiveValidationResult implements ValidationResult {
  private static instance = new PositiveValidationResult();

  private constructor() {}

  static getInstance() {
    return this.instance;
  }
}

/**
 * Represents failed validation. Inherit from this class for a more detailed
 * result.
 *
 * @example
 * class GoofedValidation extends NegativeValidationResult {
 *   constructor(readonly invalidFields: Field[]) {
 *     super();
 *   }
 * }
 */
export class NegativeValidationResult implements ValidationResult {}

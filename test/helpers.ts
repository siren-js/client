export function expectValidationError(property: string, constraints: string[]) {
  return expect.objectContaining({
    property,
    constraints: Object.fromEntries(constraints.map((constraint) => [constraint, expect.stringContaining(property)]))
  });
}

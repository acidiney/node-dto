export const TYPES = {
  STRING: 'String',
  NUMBER: 'Number',
  DATE: 'Date',
  BOOLEAN: 'Boolean',
  OBJECT: 'Object',
  ENUM: 'Enum',
  ARRAY: 'Array',
};

/**
 * Validates if a given type string is one of the predefined types.
 * @param {string} type The type string to validate.
 * @returns {{ success: boolean, value?: [string, string] }} Returns an object indicating whether the type is valid.
 */
export const validateType = (type) => {
  const availableTypes = Object.keys(TYPES);

  if (!availableTypes.find((t) => TYPES[t] === type)) {
    return {
      success: false,
      value: ['INVALID_TYPE_ERROR', `${type} was not recognized!`],
    };
  }

  return {
    success: true,
  };
};

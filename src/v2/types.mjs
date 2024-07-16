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
 * @param {string} type
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

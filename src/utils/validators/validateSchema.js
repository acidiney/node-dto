const ValidateException = require('../../exceptions/ValidateException');

const exceptionTypes = {
  Enum: 'Enum',
  Array: 'Array',
  Object: 'Object',
};

const validateProp = {
  Enum: 'enumOps',
  Object: 'schema',
};

function validateExceptions(row, validateArray, validateEnum, schema, AvailableTypes) {
  const prop = validateProp[row.type];

  if (prop) {
    if (row.type && (!row[prop] || !row[prop].length))
      throw new ValidateException(
        `Prop '${prop}' is required when you choose type '${row.type}'!`
      );

    if (row.type === exceptionTypes.Object) {
      validateSchema(row.schema, validateArray, validateEnum, schema, AvailableTypes);
    }

    if (row.type === exceptionTypes.Enum) {
      validateArray(row.enumOps);
    }
  }

  return;
}

function validateSchema(params, validateArray, validateEnum, schema, AvailableTypes) {
  validateArray(params);
  validateArray(params, AvailableTypes.Object, 'Object');

  for (let i = 0; i < params.length; i++) {
    const row = params[i];
    const keys = Object.keys(row);

    for (const key of schema) {
      validateEnum(key, keys, `Prop '${key}' is missing on schema index ${i}!`);
    }

    validateExceptions(row, validateArray, validateEnum, schema, AvailableTypes);
  }

  const availableTypes = Object.keys(AvailableTypes);
  const types = params.map((dt) => dt.type);

  types.forEach((type) => {
    if (!availableTypes.includes(type)) {
      throw new ValidateException(`${type} was not recognized!`);
    }
  });
}

module.exports = {
  exceptionTypes,
  validateSchema,
};

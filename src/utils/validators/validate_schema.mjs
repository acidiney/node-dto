import { ValidateException } from '../../exceptions/validate_exception.mjs';
const exceptionTypes = {
  Enum: 'Enum',
  Array: 'Array',
  Object: 'Object',
};

const validateProp = {
  Enum: 'enumOps',
  Object: 'schema',
  Array: 'itemsType',
};

function validateExceptions(
  row,
  validateArray,
  validateEnum,
  schema,
  AvailableTypes
) {
  const prop = validateProp[row.type];

  if (prop) {
    if (row.type && (!row[prop] || !row[prop].length))
      throw new ValidateException(
        `Prop '${prop}' is required when you choose type '${row.type}'!`
      );

    if (row.type === exceptionTypes.Object) {
      validateSchema(
        row.schema,
        validateArray,
        validateEnum,
        schema,
        AvailableTypes
      );
    }

    if (row.type === exceptionTypes.Array) {
      if (row.itemsType === exceptionTypes.Array) {
        throw new ValidateException(
          "Can't cambine type Array with itemsType Array!"
        );
      }

      validateType(AvailableTypes, [row.itemsType]);

      validateExceptions(
        {
          ...row,
          type: row.itemsType,
        },
        validateArray,
        validateEnum,
        schema,
        AvailableTypes
      );
    }

    if (row.type === exceptionTypes.Enum) {
      validateArray(row.enumOps);
    }
  }

  return;
}

function validateSchema(
  params,
  validateArray,
  validateEnum,
  schema,
  AvailableTypes
) {
  validateArray(params);
  validateArray(params, AvailableTypes.Object, 'Object');

  if (params.length === 0) {
    throw new ValidateException('NO_SCHEMA_DEFINED_ERROR');
  }

  for (let i = 0; i < params.length; i++) {
    const row = params[i];
    const keys = Object.keys(row);

    for (const key of schema) {
      validateEnum(key, keys, `Prop '${key}' is missing on schema index ${i}!`);
    }

    if (row.defaultValue) {
      result =
        row.type === 'Enum'
          ? AvailableTypes[row.type](row.defaultValue, row.enumOps)
          : AvailableTypes[row.type](row.defaultValue);
      if (!result) {
        throw new ValidateException(
          `Value of the Field defaultValue is not of the type '${row.type}' on schema index ${i}!`
        );
      }
    }

    validateExceptions(
      row,
      validateArray,
      validateEnum,
      schema,
      AvailableTypes
    );
  }

  validateType(
    AvailableTypes,
    params.map((dt) => dt.type)
  );
}

function validateType(AvailableTypes, types) {
  const availableTypes = Object.keys(AvailableTypes);

  types.forEach((type) => {
    if (!availableTypes.includes(type)) {
      throw new ValidateException(`${type} was not recognized!`);
    }
  });
}

export { exceptionTypes, validateSchema };

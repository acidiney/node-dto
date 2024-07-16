'use strict';

/**
 *
 * @type {{validateEnum: (function(*=, *): boolean)}}
 */
export function validateEnum(data, options, customMessage = null) {
  if (!options.includes(data))
    return {
      success: false,
      message: [
        'INVALID_ENUM_ERROR',
        customMessage ||
        `Value ${data} don't exists on enum ${options.join(',')}!`,
      ],
    };

  return {
    success: true,
    value: data,
  };
}

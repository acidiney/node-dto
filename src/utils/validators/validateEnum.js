'use strict';

const ValidateException = require('../../exceptions/ValidateException');

/**
 *
 * @type {{validateEnum: (function(*=, *): boolean)}}
 */
module.exports = {
    /**
     *
     * @param {String|Number} data
     * @param {Object[]} options
     * @param {String|null} customMessage
     * @returns {boolean}
     */
    validateEnum: (data, options, customMessage = null) => {
        if (!options.includes(data))
            throw new ValidateException(customMessage || `Value ${data} don't exists on enum ${options.join(',')}!`);
        return true;
    }
}
'use strict';

const ValidateException = require('../../exceptions/ValidateException');

/**
 *
 * @type {{validateArray: exports.validateArray}}
 */
module.exports = {
    /**
     *
     * @param {object[]} array
     * @param {string} validateFn
     * @param {string} validateKey
     */
    validateArray: (array, validateFn = null, validateKey = null) => {
        if (!validateFn) {
            if (!(array instanceof Array))
                throw new ValidateException('Schema need to be an array');
            return
        }

        if (!array.every((p) => validateFn(p)))
            throw new ValidateException(`Schema need to be an array of ${validateKey}`);
    }
}
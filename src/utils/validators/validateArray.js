'use strict';

const AvailableTypes = require('../types')
const ValidateException = require('../../exceptions/ValidateException');

/**
 *
 * @type {{validateArray: exports.validateArray}}
 */
module.exports = {
    /**
     *
     * @param {object[]} array
     * @param {AvailableTypes} itemType
     */
    validateArray: (array, itemType = null) => {
        if (!itemType) {
            if (!(array instanceof Array))
                throw new ValidateException('Schema need to be an array');
            return
        }

        const validateFn = AvailableTypes[itemType];
        if (!array.every((p) => validateFn(p)))
            throw new ValidateException(`Schema need to be an array of ${itemType}`);
    }
}
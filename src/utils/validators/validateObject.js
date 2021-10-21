'use strict';

/**
 *
 * @type {{validateObject: (function(*): boolean)}}
 */
module.exports = {
    validateObject: (obj) => typeof obj === 'object'
}
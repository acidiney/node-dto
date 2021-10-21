'use strict';

/**
 *
 * @type {{validateBoolean: (function(*=): boolean)}}
 */
module.exports = {
    validateBoolean: (value) => typeof value === 'boolean'
}
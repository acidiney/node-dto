/**
 *
 * @type {{validateString: (function(*=): boolean)}}
 */
module.exports = {
    validateString: (value) => typeof value === 'string'
}
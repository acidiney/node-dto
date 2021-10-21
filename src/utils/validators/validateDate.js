/**
 *
 * @type {{validateDate: (function(*): boolean)}}
 */
module.exports = {
    validateDate: (value) => value instanceof Date
}
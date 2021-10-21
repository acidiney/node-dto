'use strict';
const { validateString, validateNumber, validateBoolean, validateDate, validateObject } = require('./validators')

module.exports = {
    String: validateString,
    Number: validateNumber,
    Date: validateDate,
    Boolean: validateBoolean,
    Object: validateObject
}
'use strict';

const validateNumber = (value) => typeof value === 'number'
const validateString = (value) => typeof value === 'string'
const validateDate = (value) => value instanceof Date;
const validateBoolean = (value) => typeof value === 'boolean'

module.exports = {
    String: validateString,
    Number: validateNumber,
    Date: validateDate,
    Boolean: validateBoolean
}
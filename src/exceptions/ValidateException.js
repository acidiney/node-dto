'use strict';

const { LogicalException } = require('node-exceptions');

class ValidateException extends LogicalException {}

module.exports = ValidateException
import { NodeDto } from './node_dto.mjs';
import { TYPES } from './types.mjs';

/**
 * Represents a schema for defining properties.
 * @typedef {Array<Property>} Schema
 */

/**
 * Represents all supported types.
 * @typedef {(Number|string|Date|boolean|Enum|Object|Array)} Type
 */

/**
 * Represents a property object in the schema.
 * @typedef {Object} Property
 * @property {string} name - Name of the property.
 * @property {Type} type - Type of the property.
 * @property {boolean} required - Whether the property is required.
 * @property {string} serialize - Serialization function for the property.
 * @property {Array} [enumOps] - Required if type is Enum. Array of options for Enum type.
 * @property {Schema} [schema] - Required if type is Object. Schema definition for the Object type.
 * @property {Type} [itemsType] - Required if type is Array. Type of items in the array.
 */

/**
 * Represents an Enum type.
 * @typedef {string[]} Enum
 */

/**
 * Function that uses a schema definition.
 * @param {Schema} params - Definition of the schema.
 * @returns {NodeDto}
 */

export const MakeDto = (params) => new NodeDto(params);
export { TYPES };

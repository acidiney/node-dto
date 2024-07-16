import { describe, it } from 'node:test';
import assert from 'node:assert';
import { TYPES } from '../../src/v2/types.mjs';
import { NodeDto } from '../../src/v2/node_dto.mjs';

describe('NodeDto - constructor', () => {
  it('should throws when schema is not defined', () => {
    assert.throws(() => {
      new NodeDto();
    }, new Error('SCHEMA_NOT_DEFINED_ERROR'));
  });

  it('should throws when schema is not an array', () => {
    assert.throws(() => {
      new NodeDto({});
    }, new Error('SCHEMA_NOT_AN_ARRAY_ERROR'));

    assert.throws(() => {
      new NodeDto('invalid schema');
    }, new Error('SCHEMA_NOT_AN_ARRAY_ERROR'));
  });

  it('should throws when schema is an empty array', () => {
    assert.throws(() => {
      new NodeDto([]);
    }, new Error('SCHEMA_EMPTY_ERROR'));
  });

  it('should throws when schema is missing required props', () => {
    assert.throws(() => {
      new NodeDto([
        {
          name: 'test',
          type: TYPES.OBJECT,
        },
      ]);
    }, new Error('SCHEMA_MALFORMED_ERROR'));
  });

  it('should throws when defaultValue is not same type as schema type', () => {
    assert.throws(() => {
      new NodeDto([
        {
          name: 'test',
          type: TYPES.OBJECT,
          defaultValue: 1,
          required: true,
          serialize: 'test',
        },
      ]);
    }, new Error('INVALID_DEFAULT_TYPE_VALUE_ERROR'));
  });

  it('should throws when an invalid type is used', () => {
    assert.throws(() => {
      new NodeDto([
        {
          name: 'test',
          type: 'invalid type',
          defaultValue: 1,
          required: true,
          serialize: 'test',
        },
      ]);
    }, new Error('INVALID_TYPE_ERROR'));
  });

  it('should throws when type is object but schema is not defined', () => {
    assert.throws(() => {
      new NodeDto([
        {
          name: 'test',
          type: TYPES.OBJECT,
          required: true,
          serialize: 'test',
        },
      ]);
    }, new Error('RECOGNIZED_SPECIAL_TYPE_NOT_DEFINED_ERROR'));
  });

  it('should throws when type is object but schema is empty', () => {
    assert.throws(() => {
      new NodeDto([
        {
          name: 'test',
          type: TYPES.OBJECT,
          required: true,
          serialize: 'test',
          schema: [],
        },
      ]);
    }, new Error('SCHEMA_EMPTY_ERROR'));
  });

  it('should throws when type is object but schema is not an array', () => {
    assert.throws(() => {
      new NodeDto([
        {
          name: 'test',
          type: TYPES.OBJECT,
          required: true,
          serialize: 'test',
          schema: 'abc',
        },
      ]);
    }, new Error('SCHEMA_NOT_AN_ARRAY_ERROR'));
  });

  it('should throws when type is enum but enumOps was not defined', () => {
    assert.throws(() => {
      new NodeDto([
        {
          name: 'test',
          type: TYPES.ENUM,
          required: true,
          serialize: 'test',
        },
      ]);
    }, new Error('RECOGNIZED_SPECIAL_TYPE_NOT_DEFINED_ERROR'));
  });

  it('should throws when type is enum but enumOps is not an array', () => {
    assert.throws(() => {
      new NodeDto([
        {
          name: 'test',
          type: TYPES.ENUM,
          required: true,
          serialize: 'test',
          enumOps: 'abc',
        },
      ]);
    }, new Error('SCHEMA_NOT_AN_ARRAY_ERROR'));
  });
  it('should throws when type is enum but enumOps is empty', () => {
    assert.throws(() => {
      new NodeDto([
        {
          name: 'test',
          type: TYPES.ENUM,
          required: true,
          serialize: 'test',
          enumOps: [],
        },
      ]);
    }, new Error('ENUM_EMPTY_ERROR'));
  });

  it('should throws when type is array but itemsType was not defined', () => {
    assert.throws(() => {
      new NodeDto([
        {
          name: 'test',
          type: TYPES.ARRAY,
          required: true,
          serialize: 'test',
        },
      ]);
    }, new Error('RECOGNIZED_SPECIAL_TYPE_NOT_DEFINED_ERROR'));
  });

  it('should throws when type is array but itemsType is array also', () => {
    assert.throws(() => {
      new NodeDto([
        {
          name: 'test',
          type: TYPES.ARRAY,
          required: true,
          serialize: 'test',
          itemsType: TYPES.ARRAY,
        },
      ]);
    }, new Error('CANNOT_USE_ARRAY_AS_ITEMS_TYPE_ERROR'));
  });

  it('should throws when type is array but itemsType  type not exist', () => {
    assert.throws(() => {
      new NodeDto([
        {
          name: 'test',
          type: TYPES.ARRAY,
          required: true,
          serialize: 'test',
          itemsType: 'abc',
        },
      ]);
    }, new Error('RECOGNIZED_TYPE_NOT_DEFINED_ERROR'));
  });
});

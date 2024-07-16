import { describe, it } from 'node:test';
import assert from 'node:assert';
import { TYPES } from '../src/types.mjs';
import { NodeDto } from '../src/node_dto.mjs';

describe('NodeDto - Functions', () => {
  it('should throws when input inst numeric', () => {
    const sut = new NodeDto([
      {
        name: 'Numeric',
        type: TYPES.NUMBER,
        required: true,
        serialize: 'numeric',
      },
    ]);

    assert.throws(() => {
      sut.validate({ Numeric: 'abc', string1: 123 });
    }, new Error('INVALID_NUMBER_ERROR'));
  });

  it('should throws when an array input has some numeric field not numeric', () => {
    const sut = new NodeDto([
      {
        name: 'Numeric',
        type: TYPES.NUMBER,
        required: true,
        serialize: 'numeric',
      },
    ]);

    assert.throws(() => {
      sut.validate([{ Numeric: 'abc' }, { Numeric: 123 }]);
    }, new Error('INVALID_NUMBER_ERROR'));
  });

  it('should returns a list of errors with success false when invalid type is provided as data', () => {
    const sut = new NodeDto([
      {
        name: 'Numeric',
        type: TYPES.NUMBER,
        required: true,
        serialize: 'numeric',
      },
      {
        name: 'Duplicate',
        type: TYPES.BOOLEAN,
        required: false,
        defaultValue: false,
        serialize: 'duplicate',
      },
    ]);

    const output = sut.validateAsync([{ Numeric: 'abc', Duplicate: null }]);

    assert.deepStrictEqual(output, {
      success: false,
      errors: [{ numeric: 'INVALID_NUMBER_ERROR' }],
    });
  });
});

import assert from 'node:assert';
import { describe, it } from 'node:test';
import { MakeDto } from '../src/index.mjs';
import { TYPES } from '../src/types.mjs';
import { NodeDto } from '../src/node_dto.mjs';

describe('Check older API', () => {
  it('MakeDto should be instance of NodeDto', async () => {
    const dto = MakeDto([
      { name: 'name', type: TYPES.STRING, required: true, serialize: 'name' },
    ]);

    assert(dto instanceof NodeDto);
  });

  it('MakeDto should have all NodeDto public method', () => {
    const dto = MakeDto([
      { name: 'name', type: TYPES.STRING, required: true, serialize: 'name' },
    ]);

    assert.strictEqual(typeof dto.entries, 'function');
    assert.strictEqual(typeof dto.export, 'function');
    assert.strictEqual(typeof dto.validate, 'function');
    assert.strictEqual(typeof dto.validateAsync, 'function');
    assert.strictEqual(typeof dto.exportUsingSQL, 'function');
  });
});

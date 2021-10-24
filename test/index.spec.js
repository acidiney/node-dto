'use strict';

const { expect } = require('chai');
const { MakeDto } = require('../src/index');

describe('nodejs-dto', () => {
  it('shoud not accept nothing different of array to make schema', () => {
    expect(() =>
      MakeDto({
        name: 'testName',
        serialize: 'name',
        type: 'Image',
        required: true,
      })
    ).to.throw('Schema need to be an array');

    expect(() => MakeDto()).to.throw('Schema need to be an array');

    expect(() => MakeDto(['trash'])).to.throw('Schema need to be an array of Object');
  });

  it('shoud throws an error when props is missing', () => {
    expect(() =>
      MakeDto([
        {
          name: 'testName',
          serialize: 'name',
          required: true,
        }
      ])
    ).to.throw('Prop \'type\' is missing on schema index 0');
  })

  it('should not accept valid type [Image]', () => {
    expect(() =>
      MakeDto([
        {
          name: 'testName',
          serialize: 'name',
          type: 'Image',
          required: true,
        },
      ])
    ).to.throw('Image was not recognized!');
  });

  it('should throws error when required field is not filled', () => {
    const dto = MakeDto([
      {
        name: 'age',
        serialize: 'age',
        type: 'Number',
        required: true,
      },
    ]);

    expect(() =>
      dto.validate({
        age: null,
      })
    ).to.throw('Field age is required!');
  });

  it('shoud throws an error when pass a different type of value', () => {
    const dto = MakeDto([
      {
        name: 'Age',
        serialize: 'age',
        type: 'Number',
        required: true,
      },
    ]);

    const requestProps = {
      Age: 'Acidiney',
    };

    expect(() => dto.validate(requestProps)).to.throws('Field Age with value Acidiney, is not typeof Number');
  });

  it('should validate all entries and returns a object with serialized data', () => {
    const dto = MakeDto([
      {
        name: 'Age',
        serialize: 'age',
        type: 'Number',
        required: true,
      },
    ]);

    const requestProps = {
      Age: 12,
    };

    const props = {
      age: 12,
    };

    expect(dto.validate(requestProps)).to.deep.equal(props);
  });

  it('should returns all entries', () => {
    const dto = MakeDto([
      {
        name: 'Age',
        serialize: 'age',
        type: 'Number',
        required: true,
      },
      {
        name: 'Name',
        serialize: 'name',
        type: 'String',
        required: false,
      },
    ]);

    expect(dto.entries()).to.deep.equal(['Age', 'Name']);
  });

  it('should get an model data from db to export', () => {
    const dto = MakeDto([
      {
        name: 'Age',
        serialize: 'age',
        type: 'Number',
        required: true,
      },
      {
        name: 'Name',
        serialize: 'name',
        type: 'String',
        required: false,
      },
    ]);

    expect(dto.export({ age: 12, name: 'Acidiney Dias' })).to.deep.equal({
      Age: 12,
      Name: 'Acidiney Dias',
    });
  });

  it('should export an sql without entity to runs on select', () => {
    const dto = MakeDto([
      {
        name: 'Age',
        serialize: 'age',
        type: 'Number',
        required: true,
      },
      {
        name: 'Name',
        serialize: 'name',
        type: 'String',
        required: false,
      },
    ]);

    expect(dto.exportUsingSQL()).to.deep.equal(['age as Age', 'name as Name']);
  });

  it('should export an sql with entity to runs on select', () => {
    const dto = MakeDto([
      {
        name: 'Age',
        serialize: 'age',
        type: 'Number',
        required: true,
      },
      {
        name: 'Name',
        serialize: 'name',
        type: 'String',
        required: false,
      },
    ]);

    expect(dto.exportUsingSQL('users')).to.deep.equal([
      'users.age as Age',
      'users.name as Name',
    ]);
  });

  it('should parse result of validate, need to Number', () => {
    const dto = MakeDto([
      {
        name: 'Age',
        serialize: 'age',
        type: 'Number',
        required: true,
      },
    ]);

    expect(dto.validate({
      Age: '123'
    })).to.deep.equal({
      age: 123
    });


    expect(dto.validate({
      Age: '1e3'
    })).to.deep.equal({
      age: 1000
    });
  })

  it('should throws an error when select type \'Enum\' but enumOps is not founded', () => {
    expect(() => MakeDto([
      {
        name: 'status',
        type: 'Enum',
        serialize: 'status',
        required: true,
      }
    ])).to.throws('Prop \'enumOps\' is required when you choose type \'Enum\'!')
  })

  it('should throws an error when select type \'Enum\' but enumOps length is 0', () => {
    expect(() => MakeDto([
      {
        name: 'status',
        type: 'Enum',
        serialize: 'status',
        enumOps: [],
        required: true,
      }
    ])).to.throws('Prop \'enumOps\' is required when you choose type \'Enum\'!')
  })

  it('should success to validate a dto type [Enum]', () => {
    const dto = MakeDto([
      {
        name: 'status',
        serialize: 'status',
        type: 'Enum',
        enumOps: ['approved', 'pending', 'rejected'],
        required: true,
      },
    ]);

    const requestProps = {
      status: 'approved',
    };

    const props = {
      status: 'approved',
    };

    expect(dto.validate(requestProps)).to.deep.equal(props);
  });

  it('should throw an error when pass a wrong value after validate a dto type [Enum]', () => {
    const dto = MakeDto([
      {
        name: 'status',
        serialize: 'status',
        type: 'Enum',
        enumOps: ['approved', 'pending', 'rejected'],
        required: true,
      },
    ]);

    const requestProps = {
      status: 'canceled',
    };

    expect(() => dto.validate(requestProps)).to.throw(
      "Value canceled don't exists on enum approved,pending,rejected!"
    );
  });

  it ('should validate an array, and throws an error on index 1', () => {
    const dto = MakeDto([
      {
        name: 'Age',
        serialize: 'age',
        type: 'Number',
        required: true,
      },
      {
        name: 'Name',
        serialize: 'name',
        type: 'String',
        required: false,
      },
    ]);

    expect(() => dto.validate([
      {
        Age: 32,
        Name: 'John Doe'
      },
      {
        Age: 'Jhon Doe',
        Name: 32
      }
    ])).to.throw('Field Age with value Jhon Doe, is not typeof Number - on index #1!')

  })

  it ('should validate an array, and throws an because are missing Age on index #1', () => {
    const dto = MakeDto([
      {
        name: 'Age',
        serialize: 'age',
        type: 'Number',
        required: true,
      },
      {
        name: 'Name',
        serialize: 'name',
        type: 'String',
        required: false,
      },
    ]);

    expect(() => dto.validate([
      {
        Age: 12,
        Name: 'John Doe'
      },
      {
        Name: 'Jhon Doe'
      }
    ])).to.throw('Field Age is required - on index #1!')

  })

  it('should throws an error when select type \'Object\' but schema is not filled', () => {
      expect(() => MakeDto([
        {
          name: 'fields',
          type: 'Object',
          serialize: 'fields',
          required: true,
        }
      ])).to.throws('Prop \'schema\' is required when you choose type \'Object\'!')
  })

  it('should throws an error when select type \'Object\' but schema length is 0', () => {
    expect(() => MakeDto([
      {
        name: 'fields',
        type: 'Object',
        serialize: 'fields',
        schema: [],
        required: true,
      }
    ])).to.throws('Prop \'schema\' is required when you choose type \'Object\'!')
  })

  it('should accept an object as a type with an schema of props to validate', () => {

    const dto = MakeDto([
      {
        name: 'fields',
        type: 'Object',
        serialize: 'fields',
        required: true,
        schema: [
          {
            name: 'Name',
            serialize: 'name',
            required: true,
            type: 'String'
          },
          {
            name: 'Type',
            serialize: 'type',
            type: 'Enum',
            required: true,
            enumOps: ['number', 'array'],
          }
        ]
      }
    ])

    const requestProps = {
      fields: {
        Name: 'min',
        Type: 'number'
      }
    }

    const expectOutput = {
      fields: {
        name: 'min',
        type: 'number'
      }
    }

    expect(dto.validate(requestProps)).to.deep.equal(expectOutput)
  })

  it('should throw an error when type of the value in the defaultValue field does not match with the field type',()=>{
    expect(() => MakeDto([
      {
        name: 'someDto',
        type: 'Number',
        serialize: 'some_dto',
        required: true,
        defaultValue: 'wrongType',  
      }
    ])).to.throws('Value of the Field defaultValue is not of the type \'Number\' on schema index 0!');
  })

  it('should successfully validate a dto with null value and return with that dto with default value', () => {
    const dto = MakeDto([
      {
        name: 'status',
        serialize: 'status',
        type: 'Enum',
        enumOps: ['approved','unknown','pending', 'rejected'],
        defaultValue: 'unknown',
        required: false,
      },
    ]);
    
    const requestProps = {
      status: null,
    };

    const props = {
      status: 'unknown',
    };

    expect(dto.validate(requestProps)).to.deep.equal(props);
  })
});

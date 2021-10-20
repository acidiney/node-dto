'use strict';

const { expect } = require('chai')
const { MakeDto } = require('../src/index')

describe('nodejs-dto', () => {
    it('should not accept valid type [Image]', () => {
        expect(() => MakeDto([
            {
                name: 'testName',
                serialize: 'name',
                type: 'Image',
                required: true
            }
        ])).to.throw()
    })

    it('should throws error when required field is not filled', () => {

        const dto = MakeDto([
            {
                name: 'age',
                serialize: 'age',
                type: 'Number',
                required: true
            }
        ])

        expect(() => dto.validate({
            age: null
        })).to.throw()
    })

    it('shoud throws an error when pass a different type of value', () => {
        const dto = MakeDto([
            {
                name: 'Age',
                serialize: 'age',
                type: 'Number',
                required: true
            }
        ])

        const requestProps = {
            Age: 'Acidiney'
        }

        expect(() => dto.validate(requestProps)).to.throws()
    })

    it('should validate all entries and returns a object with serialized data', () => {
        const dto = MakeDto([
            {
                name: 'Age',
                serialize: 'age',
                type: 'Number',
                required: true
            }
        ])

        const requestProps = {
            Age: 12
        }

        const props = {
            age: 12
        }

        expect(dto.validate(requestProps)).to.deep.equal(props)
    })

    it('should returns all entries', () => {
        const dto = MakeDto([
            {
                name: 'Age',
                serialize: 'age',
                type: 'Number',
                required: true
            },
            {
                name: 'Name',
                serialize: 'name',
                type: 'String',
                required: false
            }
        ])


        expect(dto.entries()).to.deep.equal(['Age', 'Name'])
    })

    it('should get an model data from db to export', () => {
        const dto = MakeDto([
            {
                name: 'Age',
                serialize: 'age',
                type: 'Number',
                required: true
            },
            {
                name: 'Name',
                serialize: 'name',
                type: 'String',
                required: false
            }
        ])

        expect(dto.export({ age: 12, name: 'Acidiney Dias' })).to.deep.equal({
            Age: 12,
            Name: 'Acidiney Dias'
        })
    })

    it('should export an sql without entity to runs on select', () => {
        const dto = MakeDto([
            {
                name: 'Age',
                serialize: 'age',
                type: 'Number',
                required: true
            },
            {
                name: 'Name',
                serialize: 'name',
                type: 'String',
                required: false
            }
        ])

        expect(dto.exportUsingSQL()).to.deep.equal([
            'age as Age',
            'name as Name'
        ])
    })

    it('should export an sql with entity to runs on select', () => {
        const dto = MakeDto([
            {
                name: 'Age',
                serialize: 'age',
                type: 'Number',
                required: true
            },
            {
                name: 'Name',
                serialize: 'name',
                type: 'String',
                required: false
            }
        ])

        expect(dto.exportUsingSQL('users')).to.deep.equal([
            'users.age as Age',
            'users.name as Name'
        ])
    })
})
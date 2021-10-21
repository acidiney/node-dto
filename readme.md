# Node Dto
[![CodeQL](https://github.com/acidiney/node-dto/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/acidiney/node-dto/actions/workflows/codeql-analysis.yml)
[![Node.js Package](https://github.com/acidiney/node-dto/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/acidiney/node-dto/actions/workflows/npm-publish.yml)
[![CircleCI](https://circleci.com/gh/acidiney/node-dto/tree/master.svg?style=svg)](https://circleci.com/gh/acidiney/node-dto/tree/master)

Node Dto is a small lib, that help developer to create dto's using javascript.

This package is focused only in javascript.

```bash
$ npm i node-dto
```

# How use

The `node-dto` package exports `MakeDto` function, that is a factory to generate your custom `Dto's`.

The `MakeDto` function receive an array of object with this schema:
```
{
  name: String,
  serialize: String,
  type: 'Number' | 'String' | 'Date' | 'Boolean',
  required: Boolean
}
```

## Name

The `name` field is what key on object or array you will send. Eg. `{ fullName: 'Acidiney Dias' }`

## Serialize

The `serialize` field is the key the will be used to export after validate dto. Eg.  `{ full_name: 'Acidiney Dias' }`

## Type

As name said, the `type` field tell to dto internal function how to validate this field.

This help us, to skip unecessary `if` statemenet to check types.

Note: If you pass an invalid type, you will receive an `ValidateException`.

## Required

The `required` field, tell to dto internal function if can ignore when receive `null` in this field.

This prevents possible errors.

Eg. Receive an `null` on functions that calculate something.

# Available Methods

## .entries()

The `entries()` function returns all `name` keys wroted when Dto schema was created.

Eg:

```js

// CreateUserDto.js

const { MakeDto } = require('node-dto')

module.exports = MakeDto([
  {
    name: 'firstName',
    serialize: 'first_name',
    required: true,
    type: 'String'
  },
  {
    name: 'lastName',
    serialize: 'last_name',
    required: true,
    type: 'String'
  },
  {
    name: 'email',
    serialize: 'email',
    required: true,
    type: 'String'
  }
])


// UserController.js

console.log(CreateUserDto.entries()) // firstName, lastName, email

```
You can use this, in `request.only` for example to retrive from request only this elements.

## .validate(obj: Object)

The `.validate` function receive the current payload, validate with type and obrigatority and returns an serialized `object` or throws an `ValidateException`.

Eg.

Dto:
```js

module.exports = MakeDto([
  {
    name: 'firstName',
    serialize: 'first_name',
    required: true,
    type: 'String'
  },
  {
    name: 'lastName',
    serialize: 'last_name',
    required: true,
    type: 'String'
  },
  {
    name: 'email',
    serialize: 'email',
    required: true,
    type: 'String'
  }
])

```

Comes:
```js

CreateUserDto.validate({
  firstName: 'Acidiney',
  lastName: 'Dias',
  email: 'acidineydias@gmail.com'
})

```

Returns:
```json

{
  first_name: 'Acidiney',
  last_name: 'Dias',
  email: 'acidineydias@gmail.com'
}

```

Or an exception when something is wrong:

Comes:
```js

CreateUserDto.validate({
  firstName: 928292,
  lastName: 'Dias',
  email: 'acidineydias@gmail.com'
})

```

Returns:
```js

ValidateException: Field firstName with value 928292, is not valid!

```

## .export(data: Object | Array)

Sometimes you receive data from your database for exemple in one format like `snake_case` and you need tou transform to `camelCase`, in order to mantain your code more clean.

The `.export` function receives the untreated payload and returns a object using the fields `name` and `serialize` in your `Dto`.

Eg.

```js

module.exports = MakeDto([
  {
    name: 'firstName',
    serialize: 'first_name',
    required: true,
    type: 'String'
  },
  {
    name: 'lastName',
    serialize: 'last_name',
    required: true,
    type: 'String'
  },
  {
    name: 'email',
    serialize: 'email',
    required: true,
    type: 'String'
  }
])

```


Comes:
```js

CreateUserDto.export({
  first_name: 'Acidiney',
  last_name: 'Dias',
  email: 'acidineydias@gmail.com'
})

// or

CreateUserDto.export([
  {
  first_name: 'Acidiney',
  last_name: 'Dias',
  email: 'acidineydias@gmail.com'
},
{
  first_name: 'Jhon',
  last_name: 'Doe',
  email: 'jhon.doe@xyz.com'
}
])

```

Returns:
```

{
  firstName: 'Acidiney',
  lastName: 'Dias',
  email: 'acidineydias@gmail.com'
}

```

Or

```

[
  {
    firstName: 'Acidiney',
    lastName: 'Dias',
    email: 'acidineydias@gmail.com'
  },
  {
    firstName: 'Jhon',
    lastName: 'Doe',
    email: 'jhon.doe@xyz.com'
  }
]
```

## .exportUsingSQL(entity = null)

Sometimes using `.export` function can be slower, if you are using too much data.

In this case, you can use `.exportUsingSQL` function that consider your `Dto`, and returns an Array of `string`.

You can use this array in the `.select()` function of your ORM.

Eg. Using Knex

```js
  const users = await knex.from('users')
    .select(...Users.exportUsingSQL())
    .fetch();
```

Considering `join's` in queries you can pass the name of `entity` that this `Dto` belongs.


```js
  const users = await knex.from('tokens')
    .select('tokens.token', ...Users.exportUsingSQL('users'))
    .innerJoin('users', 'tokens.user_id', 'users.id')
    .fetch();
```

Feel free to submit an PR, to help project.

Thanks ^^

### Author

Acidiney Dias

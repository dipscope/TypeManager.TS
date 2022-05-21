# TypeManager.TS

![GitHub](https://img.shields.io/github/license/dipscope/TypeManager.TS) ![NPM](https://img.shields.io/npm/v/@dipscope/type-manager) ![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)

Type manager is a parsing package for `TypeScript` which will help you to transform JSON strings or plain objects into `JavaScript` object instances. It supports [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) or declarative configuration and allows you to configure parsing of your or 3rd party classes easily.

We recommend to use our [official website](https://dipscope.com/type-manager/what-issues-it-solves) to navigate through available features. You can also use the latest documentation described below.

## Give a star :star:

If you like or are using this project please give it a star. Thanks!

## Table of contents

* [What issues it solves?](#what-issues-it-solves)
* [Installation](#installation)
* [How it works?](#how-it-works)
* [Defining decorators](#defining-decorators)
    * [Type decorator](#type-decorator)
    * [Property decorator](#property-decorator)
    * [Inject decorator](#inject-decorator)
* [Defining helper decorators](#defining-helper-decorators)
    * [Alias decorator](#alias-decorator)
    * [Custom data decorator](#custom-data-decorator)
    * [Default value decorator](#default-value-decorator)
    * [Deserializable decorator](#deserializable-decorator)
    * [Discriminant decorator](#discriminant-decorator)
    * [Discriminator decorator](#discriminator-decorator)
    * [Factory decorator](#factory-decorator)
    * [Injectable decorator](#injectable-decorator)
    * [Injector decorator](#injector-decorator)
    * [Naming convention decorator](#naming-convention-decorator)
    * [Preserve discriminator decorator](#preserve-discriminator-decorator)
    * [Reference handler decorator](#reference-handler-decorator)
    * [Serializable decorator](#serializable-decorator)
    * [Serializer decorator](#serializer-decorator)
    * [Use default value decorator](#use-default-value-decorator)
    * [Use implicit conversion decorator](#use-implicit-conversion-decorator)
* [Defining configuration manually](#defining-configuration-manually)
    * [Configuring global options](#configuring-global-options)
    * [Configuring options per type](#configuring-options-per-type)
    * [Configuring usage of polymorphic types](#configuring-usage-of-polymorphic-types)
    * [Configuring naming convention](#configuring-naming-convention)
    * [Configuring reference handler](#configuring-reference-handler)
* [Advanced usage](#advanced-usage)
    * [Defining custom data](#defining-custom-data)
    * [Defining custom serializer](#defining-custom-serializer)
    * [Defining custom injector](#defining-custom-injector)
    * [Defining custom factory](#defining-custom-factory)
    * [Defining custom naming convention](#defining-custom-naming-convention)
* [Use cases](#use-cases)
    * [Built in serializers](#built-in-serializers)
    * [Circular object references](#circular-object-references)
    * [Dependency injection and immutable types](#dependency-injection-and-immutable-types)
    * [Different case usage in class and JSON](#different-case-usage-in-class-and-json)
    * [Enum types](#enum-types)
    * [Generic types](#generic-types)
    * [Integration with Angular](#integration-with-angular)
    * [Polymorphic types](#polymorphic-types)
* [Notes](#notes)
* [License](#license)

## What issues it solves?

In `JavaScript` there are two types of objects:

* Plain objects which are created using `{}` notation;
* Constructor based objects which are created using `new Class()` notation.

Sometimes we want to transform plain objects to the classes we have. Let's assume we are loading a users JSON data from our backend API or the other datasource:

```json
[
    {
        "id": 1,
        "name": "Dmitry",
        "deletedAt": "2021-02-22T20:15:00.000Z"
    },
    {
        "id": 2,
        "name": "Alex",
        "deletedAt": null
    },
    {
        "id": 3,
        "name": "Anna",
        "deletedAt": null
    }
]
```

We have a `User` class:

```typescript
export class User
{
    public id: number;
    public name: string;
    public deletedAt: Date;

    public constructor(id: number, name: string)
    {
        this.id = id;
        this.name = name;

        return;
    }

    public isDeleted(): boolean
    {
        return this.deletedAt !== null;
    }
}
```

Somewhere in code we are checking if user is deleted before performing some action.

```typescript
const users: User[] = JSON.parse(usersJson);

for (const user of users)
{
    if (user.isDeleted())
    {
        // Do some action...
    }
}
```

Do you see the problem in this piece of code? 

`JSON.parse` function returns plain objects and we actually lied to compiler when said that it is a `User` class array. In this code we can successfully use `user.id` or `user.name`. However we cannot use `user.isDeleted()` because user is not an instance of a `User` class. 

So what to do? How to get `User` array from our JSON? 

Solution is to create new instances of `User` class from plain objects returned by `JSON.parse` function. But things may go wrong once you have a more complex object hierarchy. Besides `deletedAt` property is represented as `String` in JSON but `User` class declares it as a `Date` so we also have to perform appropriate conversion when assigning this property.

There exists much more simple way. Let's use our `TypeManager` for getting instances of `User` class from JSON:

```typescript
import { TypeManager } from '@dipscope/type-manager';

const users: User[] = TypeManager.parse(User, usersJson);

for (const user of users)
{
    if (user.isDeleted())
    {
        // Do some action...
    }
}
```

Now we can use all power provided by `JavaScript` class instances. Want to know more? Let's dive into the details.

## Installation

`TypeManager.TS` is available from NPM, both for browser (e.g. using webpack) and NodeJS:

```
npm i @dipscope/type-manager
```

TypeScript needs to run with the `experimentalDecorators` and `emitDecoratorMetadata` options enabled when using decorator annotations. So make sure you have properly configured your `tsconfig.json` file.

_This package has no dependencies. If you want additional type-safety and reduced syntax you may wish to install [reflect-metadata](https://github.com/rbuckton/reflect-metadata). This step is on your choice and fully optional. When installed it must be available globally to work. This can usually be done with `import 'reflect-metadata';` in your main index file._

## How it works?

It defines configuration for each object which you are going to serialize or deserialize and uses this configuration to process data of your choice. There are two possible ways to define a configuration:

* Using decorator annotations;
* Using declarative style;

The first one is the easiest and can be used for any class you control. If you want to configure serialization of 3rd party classes, global options or you don't like decorators it is better to go with the second. There are no restrictions to use one or another. You can combine two ways of configuration depending on which one fits better.

Let's have a look at the most simple example of configuration using decorators.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(String) public name: string;
    @Property(String) public email: string;
}
```

Here we have a `User` class with `Type` and `Property` decorators assigned to it. `Type` decorator declares a type. `Property` decorator describes available properties for that type. 

The same configuration can be rewritten using declarative style.

```typescript
import { TypeManager } from '@dipscope/type-manager';
import { PropertyName, PropertyOptions } from '@dipscope/type-manager/core';

export class User
{
    public name: string;
    public email: string;
}

TypeManager.configureTypeOptions(User, {
    propertyOptionsMap: new Map<PropertyName, PropertyOptions<any>>([
        ['name', { typeArgument: String }],
        ['email', { typeArgument: String }],
    ])
});
```

As you can see now our `User` class defined without decorators. Instead you have to call `TypeManager` configure method and provide `TypeOptions` related to `User` type.

No matter what style of configuration you have chosen the next step is to call serialize methods of `TypeManager` with providing a type and data you want to process.

```typescript
import { TypeManager } from '@dipscope/type-manager';

const userObject = TypeManager.serialize(User, new User());
const user = TypeManager.deserialize(User, userObject);

user instanceof User; // True.
```

Calling serialize creates a plain object and deserialize creates an instance of `User` class. During deserialize you can provide any object. It's not nesassary that object was produced by `TypeManager`. If object is an `Array` you will get array of types in return. Objects are parsed based on general type configuration defined by developer. It is also possible to stringify and parse JSON.

```typescript
import { TypeManager } from '@dipscope/type-manager';

const userJson = TypeManager.stringify(User, new User());
const user = TypeManager.parse(User, userJson);

user instanceof User; // True.
```

Stringify and parse functions are wrappers over native JSON class functions. In addition they add serialize and deserialize support under the hood. 

Static functions are not the only way to work with a `TypeManager`. You can also work on instance based manner.

```typescript
import { TypeManager } from '@dipscope/type-manager';

const userManager = new TypeManager(User);
const userObject = userManager.serialize(new User());
const user = userManager.deserialize(userObject);

user instanceof User; // True.
```

At first glance, it may seems that there is no difference but creating an instance of `TypeManager` preserves a configuration state. You can work with different configurations at the same time by providing type manager options as a second optional constructor argument. If it is not required then it is better to use static methods. They are not invoking state control which results in better performance.

## Defining decorators

We have plenty of decorators but there are only a few which controls the main flow. This are `Type`, `Property` and `Inject` decorators. Let's go through each of them.

### Type decorator

Type decorator defines a type and should be declared right before a class.

```typescript
import { Type } from '@dipscope/type-manager';

@Type()
export class User
{
    ...
}
```

This will register a new type with default type serializer assigned to it. You can define how each class should be treated by providing optional configure options as a first argument.

```typescript
import { Type } from '@dipscope/type-manager';

@Type({
    alias: 'User',
    serializer: new UserSerializer()
})
export class User
{
    ...
}
```

This call defines a type alias which can be later used to resolve a type for a property at runtime. We will talk about details in the property decorator section. Also we defined custom serializer for a type which is an implementation of `Serializer` interface. This serializer will be used later to serialize and deserialize a type including all custom logic of your choice. You can read more about [creating a custom serializer](#defining-custom-serializer) in a separate section.

There are more options can be provided for a type, so check `TypeOptions` definition or section with [helper decorators](#defining-helper-decorators) below.

### Property decorator

Property decorator defines per property configuration within a type and should be declared right before a property or accessor definition.

```typescript
import 'reflect-metadata';
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property() public name: string;
}
```

This will register a `name` property for a `User`. Each property has a type associated with it. In our case this is a `String`. By default if no configure options are provided decorator will try to resolve a property type using [reflect-metadata](https://github.com/rbuckton/reflect-metadata). If you are not using reflect metadata then such configuration will result a property type to be `unknown` and you will get an error during serialization. For such a case you have to explicitly define a property type.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(String) public name: string;
}
```

Depending on your use case there are two possible ways to configure additional property options.

If you are using [reflect-metadata](https://github.com/rbuckton/reflect-metadata) then provide options as a first argument.

```typescript
import 'reflect-metadata';
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property({ alias: 'username' }) public name: string;
}
```

If types defined explicitly then provide options as a second argument.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(String, { alias: 'username' }) public name: string;
}
```

This option configures an alias so `username` property will be used instead of `name` when deserializing from object. There are plenty of configure options, so check `PropertyOptions` definition or section with [helper decorators](#defining-helper-decorators) below. For example you can make some properties serializable only or define custom property serialization.

Now let's have a look at more complex definitions with generic types. This are `Array<TType>`, `Map<TKey, TValue>` and others. To declare one of this you have to use extra argument available for `Property` decorator. Generic arguments are always passed as array to exactly see them within a source code.

If you are using [reflect-metadata](https://github.com/rbuckton/reflect-metadata) then provide generics as a first argument so configure options will become the second.

```typescript
import 'reflect-metadata';
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property([String, Number], { alias: 'myMap' }) public map: Map<string, number>;
}
```

If types defined explicitly then provide generics as a second argument so configure options will become the third.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(Map, [String, Number], { alias: 'myMap' }) public map: Map<string, number>;
}
```

This is a full set of arguments available for the property. Basically when using [reflect-metadata](https://github.com/rbuckton/reflect-metadata) you have just to omit the first argument.

We try to simplify declarations as much as possible so you are free to use only configure options if you want and don't ever think about `Property` decorator arguments.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property({
        typeArgument: Map, 
        genericArguments: [String, Number], 
        alias: 'myMap'
    }) 
    public map: Map<string, number>;
}
```

Which syntax to use is completely on your choice. `Property` decorator is smart enough to setup everything based on usage.

Now let's talk a bit about relation types. They are not differ from built in types, so if you are using [reflect-metadata](https://github.com/rbuckton/reflect-metadata) the definition can be the following.

```typescript
import 'reflect-metadata';
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class UserStatus
{
    @Property() public title: string;
}

@Type()
export class User
{
    @Property() public userStatus: UserStatus;
}
```

With array of relations you have to use generics.

```typescript
import 'reflect-metadata';
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class UserStatus
{
    @Property() public title: string;
}

@Type()
export class User
{
    @Property([UserStatus]) public userStatuses: UserStatus[];
}
```

If types defined explicitly then definition will be the following.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class UserStatus
{
    @Property(String) public title: string;
}

@Type()
export class User
{
    @Property(UserStatus) public userStatus: UserStatus;
}
```

Then for array of relations it will be the following.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class UserStatus
{
    @Property(String) public title: string;
}

@Type()
export class User
{
    @Property(Array, [UserStatus]) public userStatuses: UserStatus[];
}
```

If any type defines an alias - it can be used as a type resolver.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type({
    alias: 'UserStatus'
})
export class UserStatus
{
    @Property(String) public title: string;
}

@Type()
export class User
{
    @Property('UserStatus') public userStatus: UserStatus;
}
```

If you have circular reference or your type declared later an extended syntax can be used to lazily define a type.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(() => UserStatus) public userStatus: UserStatus;
}

@Type()
export class UserStatus
{
    @Property(() => String) public title: string;
}
```

One great thing to know about arguments for property type and generics is that you can pass lazy function, type directly or type alias. Which definition to use is completely on your choice and dependent from certain use cases.

While property type arguments exactly match to `TypeScript` types there is a one exception for this rule. This is `Enum`. You have to provide `String` type for a string based `Enum` and `Number` type for a number based `Enum`. This is because of how `Enum` is represented after compiling it to `JavaScript`. You can read more about this [here](https://www.typescriptlang.org/docs/handbook/enums.html).

If you are using [reflect-metadata](https://github.com/rbuckton/reflect-metadata) this will be done automatically so no additional steps are required from your side.

```typescript
import 'reflect-metadata';
import { Type, Property } from '@dipscope/type-manager';

export enum UserPriorityNumeric
{
    Low,
    Medium,
    High
}

export enum UserPriorityTextual
{
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

@Type()
export class User
{
    @Property() public userPriorityNumeric: UserPriorityNumeric;
    @Property() public userPriorityTextual: UserPriorityTextual;
}
```

If types defined explicitly then definition will be the following.

```typescript
import { Type, Property } from '@dipscope/type-manager';

export enum UserPriorityNumeric
{
    Low,
    Medium,
    High
}

export enum UserPriorityTextual
{
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}

@Type()
export class User
{
    @Property(Number) public userPriorityNumeric: UserPriorityNumeric;
    @Property(String) public userPriorityTextual: UserPriorityTextual;
}
```

One should remember this when explicitly defining types for enums.

### Inject decorator

Inject decorator controls your type dependency and declared right before a constructor parameter.

```typescript
import { Type, Inject } from '@dipscope/type-manager';

@Type()
export class User
{
    public constructor(@Inject('name') name: string, @Inject(UserService) userService: UserService)
    {
        this.name = name;

        // Any action with UserService...

        return;
    }
}
```

It accepts two possible inputs as its argument.

* String key from JSON context;
* Certain type registered as injectable;

When a string key is provided then a certain value will be resolved from JSON context for you when creating an instance. If any property declares the same key you will recieve deserialized value. If not then original value will be provided instead. Injecting context values is a use case of immutable types.

When a certain type is provided it will be resolved from the dependency injection container. If you are going to use internal type injector then you should register injectable types as the following. By default singleton injector is used to resolve such services.

```typescript
import { Injectable } from '@dipscope/type-manager/helpers';

@Injectable()
export class UserService
{
    public property: string;
}
```

In most cases you will work in environment where dependency injection system is already setted up. In this case you have to implement custom `Injector` to be used instead of our default one. Besides you should follow the steps to register injectable services specified by the vendor. This means that you should not use `Injectable` decorator from our package. You can read more about [creating a custom injector](#defining-custom-injector) in a separate section.

If you are using [reflect-metadata](https://github.com/rbuckton/reflect-metadata) the injection of services can be simplified.

```typescript
import { Type, Inject } from '@dipscope/type-manager';

@Type()
export class User
{
    public constructor(@Inject('name') name: string, userService: UserService)
    {
        this.name = name;

        // Any action with UserService...

        return;
    }
}
```

Note that now you don't have to specify injection for types explicitly. However injection of values by key from JSON context still present. It's because argument names cannot be resolved using reflection.

## Defining helper decorators

`Type` and `Property` decorators provide full configuration for your classes using configure options but there is a way to define this extra options using decorators if you want. Each helper decorator exactly much the name of a certain configure option.

### Alias decorator

This decorator can be used both on type and property to define an alias.

```typescript
import { Type, Property, Alias } from '@dipscope/type-manager';

@Type()
@Alias('User')
export class User
{
    @Property(String) @Alias('username') public name: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type({ 
    alias: 'User' 
})
export class User
{
    @Property(String, { alias: 'username' }) public name: string;
}
```

Alias defined for a class can be used later for resolving property types. Note that it should be unique within application to work properly.

Alias defined for a property declares that property name differs from one specified in JSON. In our case `username` will be used instead of `name` during JSON serialization and deserialization.

### Custom data decorator

This decorator can be used to provide any custom data for type or property.

```typescript
import { Type, Property, CustomData } from '@dipscope/type-manager';

@Type()
@CustomData({ rank: 1 })
export class User
{
    @Property(String) @CustomData({ order: 1 }) public name: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type({
    customData: { rank: 1 }
})
export class User
{
    @Property(String, { customData: { order: 1 } }) public name: string;
}
```

This custom data later can be accessed in serializers, factories, injectors or your code and used accordingly. Read more about [defining custom data](#defining-custom-data) in a separate section.

### Default value decorator

This decorator is used to define a default value when one is undefined. It can be used on type or property.

```typescript
import { Type, Property, DefaultValue } from '@dipscope/type-manager';

@Type()
@DefaultValue(() => new User())
export class User
{
    @Property(String) @DefaultValue('BestName') public name: string;
}
```

This will affect both serialized and deserialized default value. This will fit perfectly for most types. You can also specify serialized and deserialized default value explicitly for complex types by using two other decorators.

```typescript
import { Type, Property, SerializedDefaultValue, DeserializedDefaultValue } from '@dipscope/type-manager';

@Type()
@SerializedDefaultValue(() => new User())
@DeserializedDefaultValue(() => new User())
export class User
{
    @Property(String) @SerializedDefaultValue('BestName') @DeserializedDefaultValue('BestName') public name: string;
}
```

Both declarations are an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type({
    serializedDefaultValue: () => new User(),
    deserializedDefaultValue: () => new User()
})
export class User
{
    @Property(String, { serializedDefaultValue: 'BestName', deserializedDefaultValue: 'BestName' }) public name: string;
}
```

As you can see it accepts an arrow function or a certain value. Both are valid for type and property. Using default values is turned off by default. You can enable them using `UseDefaultValue` decorator per type and property or enable globally using `TypeManager` configure method.

### Deserializable decorator

This decorator is used to enable or disable deserialization for a certain property.

```typescript
import { Type, Property, Deserializable } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(String) @Deserializable() public name: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(String, { deserializable: true }) public name: string;
}
```

By default all properties are deserializable.

### Discriminant decorator

This decorator is used to define a custom discriminant for a type which is later used during serialization and deserialization of polymorphic types.

```typescript
import { Type, Property, Discriminant } from '@dipscope/type-manager';

@Type()
@Discriminant('Company.Api.Entities.User')
export class User
{
    @Property(String) public name: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type({
    discriminant: 'Company.Api.Entities.User'
})
export class User
{
    @Property(String) public name: string;
}
```

You can read more about handling of polymorphic types in this [section](#configuring-usage-of-polymorphic-types).

### Discriminator decorator

This decorator can be used to define a custom property which stores discriminant of polymorphic type.

```typescript
import { Type, Property, Discriminator } from '@dipscope/type-manager';

@Type()
@Discriminator('__typename__')
export class User
{
    @Property(String) public name: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type({
    discriminator: '__typename__'
})
export class User
{
    @Property(String) public name: string;
}
```

In common use cases discriminator should be set globally using `TypeManager` configure method. Using this option on a type level makes sense only if discriminator differs from the global one. You can read more about handling of polymorphic types in this [section](#configuring-usage-of-polymorphic-types).

### Factory decorator

This decorator can be used to register a handler which should be used for constructing a type instead of default one.

```typescript
import { Type, Property, Factory } from '@dipscope/type-manager';

@Type()
@Factory(new UserFactory())
export class User
{
    @Property(String) public name: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type({
    factory: new UserFactory()
})
export class User
{
    @Property(String) public name: string;
}
```

This may be useful in cases when you want to init some special application specific properties. Read more about [defining custom factory](#defining-custom-factory) in a separate section.

### Injectable decorator

This decorator is used to register a type in dependency injection container.

```typescript
import { Injectable } from '@dipscope/type-manager';

@Type()
@Injectable()
export class UserService
{
    public property: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type } from '@dipscope/type-manager';

@Type({
    injectable: true
})
export class UserService
{
    public property: string;
}
```

Injectable type later can be provided as a dependency.

```typescript
import { Type, Property, Inject } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(String) public name: string;

    public constructor(@Inject(UserService) userService: UserService)
    {
        // Any action with UserService...

        return;
    }
}
```

In most cases you will work in environment where dependency injection system is already setted up. In this case you have to implement custom `Injector` to be used instead of our default one. Besides you should follow the steps to register injectable services specified by the vendor. This means that you should not use `Injectable` decorator from our package. You can read more about [creating a custom injector](#defining-custom-injector) in a separate section.

### Injector decorator

This decorator can be used to define a custom injector implementation which should be used in a type scope.

```typescript
import { Type, Property, Injector } from '@dipscope/type-manager';

@Type()
@Injector(new UserInjector())
export class User
{
    @Property(String) public name: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type({
    injector: new UserInjector()
})
export class User
{
    @Property(String) public name: string;
}
```

In most cases this is not required and the common use case is to specify injector globally instead. You can read more about [defining custom injector](#defining-custom-injector) in a separate section.

### Naming convention decorator

This decorator can be used both on type and property to provide custom naming strategy.

```typescript
import { Type, Property, NamingConvention } from '@dipscope/type-manager';
import { CamelCaseNamingConvention, SnakeCaseNamingConvention } from '@dipscope/type-manager/naming-conventions';

@Type()
@NamingConvention(new CamelCaseNamingConvention())
export class User
{
    @Property(String) @NamingConvention(new SnakeCaseNamingConvention()) public name: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';
import { CamelCaseNamingConvention, SnakeCaseNamingConvention } from '@dipscope/type-manager/naming-conventions';

@Type({
    namingConvention: new CamelCaseNamingConvention()
})
export class User
{
    @Property(String, { namingConvention: new SnakeCaseNamingConvention() }) public name: string;
}
```

In most cases this is not required and the common use case is to specify naming strategy globally instead. You can read more about [configuring naming convention](#configuring-naming-convention) in a separate section.

### Preserve discriminator decorator

This decorator defines if discriminator should be preserved in objects during serialization and deserialization.

```typescript
import { Type, Property, PreserveDiscriminator } from '@dipscope/type-manager';

@Type()
@PreserveDiscriminator()
export class User
{
    @Property(String) public name: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type({
    preserveDiscriminator: true
})
export class User
{
    @Property(String) public name: string;
}
```

By default discriminator is not preserved and only used during deserialization of polymorphic types. You can read more about handling of polymorphic types in this [section](#configuring-usage-of-polymorphic-types).

### Reference handler decorator

This decorator can be used both on type and property to specify how references to the same objects should be handled during serialization and deserialization.

```typescript
import { Type, Property, ReferenceHandler } from '@dipscope/type-manager';
import { DirectReferenceHandler, LeadReferenceHandler } from '@dipscope/type-manager/reference-handlers';

@Type()
@ReferenceHandler(new DirectReferenceHandler())
export class User
{
    @Property(String) @ReferenceHandler(new LeadReferenceHandler()) public name: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';
import { DirectReferenceHandler, LeadReferenceHandler } from '@dipscope/type-manager/reference-handlers';

@Type({
    referenceHandler: new DirectReferenceHandler()
})
export class User
{
    @Property(String, { referenceHandler: new LeadReferenceHandler() }) public name: string;
}
```

In most cases this is not required and the common use case is to specify reference handler globally instead. You can read more about [configuring reference handler](#configuring-reference-handler) in a separate section.

### Serializable decorator

This decorator is used to enable or disable serialization for a certain property.

```typescript
import { Type, Property, Serializable } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(String) @Serializable() public name: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(String, { serializable: true }) public name: string;
}
```

By default all properties are serializable.

### Serializer decorator

This decorator is used to define custom serializer for a type or property.

```typescript
import { Type, Property, Serializer } from '@dipscope/type-manager';

@Type()
@Serializer(new UserSerializer())
export class User
{
    @Property(String) @Serializer(new UserNameSerializer()) public name: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type({
    serializer: new UserSerializer()
})
export class User
{
    @Property(String, { serializer: new UserNameSerializer() }) public name: string;
}
```

Custom serializer should be an implementation of `Serializer` interface. You can read more about [creating a custom serializer](#defining-custom-serializer) in a separate section.

### Use default value decorator

This decorator enables or disables using default value per type or property.

```typescript
import { Type, Property, UseDefaultValue } from '@dipscope/type-manager';

@Type()
@UseDefaultValue()
export class User
{
    @Property(String) @UseDefaultValue(false) public name: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type({
    useDefaultValue: true
})
export class User
{
    @Property(String, { useDefaultValue: false }) public name: string;
}
```

Using default values is turned off by default. You can enable them globally using `TypeManager` configure method.

### Use implicit conversion decorator

By default if declared type will not match provided during serialization or deserialization an error will be logged and result value will be undefined. This means that for example assigning `Number` to `String` will not work as `StringSerializer` expects `String`. However `Number` and other types can be converted to `String` for you when implicit conversion is enabled.

```typescript
import { Type, Property, UseImplicitConversion } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(String) @UseImplicitConversion() public name: string;
}
```

Such declaration is an alternative for:

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(String, { useImplicitConversion: true }) public name: string;
}
```

With this any value which can be converted to `String` will be converted properly. Such behaviour works for other built in serializers and supported for custom ones. By default implicit conversion is turned off. You can enable it using `UseImplicitConversion` decorator per type and property or enable globally using `TypeManager` configure method.

## Defining configuration manually

There are circumstances when decorators cannot be used or you don't want to. For example you are using a 3rd party package and cannot decorate classes from it. Another use case when you want to configure some options globally. In such scenarios you can define the complete configuration through special static configure methods.

We have separate methods to configure each type manager option, so the provided examples can be simplified to avoid creating additional object. It is useful when you need to configure only one option. In our examples we are always use the main one to give you a general overview.

### Configuring global options

There are several options which can be configured globally. For example let's override using of default value option so we don't have to specify it explicitly per type or property.

```typescript
import { TypeManagerOptions } from '@dipscope/type-manager';
import { TypeOptionsBase } from '@dipscope/type-manager/core';

const typeOptionsBase: TypeOptionsBase<any> = {
    useDefaultValue: true
};

const typeManagerOptions: TypeManagerOptions = {
    typeOptionsBase: typeOptionsBase
};

TypeManager.configure(typeManagerOptions);
```

For the full list of available global options check `TypeOptionsBase` definition or follow the documentation as we are going to touch them while we proceed.

### Configuring options per type

Here is an example of declarative configuration which can be used for 3rd party or your own classes in addition to decorators.

```typescript
import { DateTime } from '@external-library';
import { TypeManagerOptions } from '@dipscope/type-manager';
import { TypeFn, TypeOptions, PropertyName, PropertyOptions } from '@dipscope/type-manager/core';

const dateTimeOptions: TypeOptions<DateTime> = {
    alias: 'DateTime',
    serializer: new DateTimeSerializer()
};

const userOptions: TypeOptions<User> = {
    alias: 'User',
    propertyOptionsMap: new Map<PropertyName, PropertyOptions<any>>(
        ['name', { typeArgument: String, serializable: true, alias: 'username' }],
        ['createdAt', { typeArgument: DateTime }]
    )
};

const typeManagerOptions: TypeManagerOptions = {
    typeOptionsMap: new Map<TypeFn<any>, TypeOptions<any>>(
        [DateTime, dateTimeOptions],
        [User, userOptions]
    )
};

TypeManager.configure(typeManagerOptions);
```

There is a well defined order to how type options are applied when using configure methods on one type. One should remember this when combining and overriding options in different places.

1. Base type options are applied;
2. Decorator type options are applied;
3. Declarative type options are applied;
4. Property type options are applied;

Declarative configuration supports the same options as decorators. With such a configuration you can declare types like the following.

```typescript
export class User
{
    public name: string;
    public createdAt: DateTime;
}
```

Also if you are declaring only 3rd party classes the use case can be the following with [reflect-metadata](https://github.com/rbuckton/reflect-metadata).

```typescript
import 'reflect-metadata';
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property() public name: string;
    @Property() public createdAt: DateTime;
}
```

And without [reflect-metadata](https://github.com/rbuckton/reflect-metadata).

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(String) public name: string;
    @Property(DateTime) public createdAt: DateTime;
}
```

### Configuring usage of polymorphic types

Let's assume we are working with a shapes. To describe different types of shape we have to create an abstract class with several descendants.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export abstract class Shape
{
    @Property(String) public title: string;
}

@Type()
export class Rectangle extends Shape
{
    @Property(Number) public width: number;
    @Property(Number) public height: number;
}

@Type()
export class Square extends Shape
{
    @Property(Number) public width: number;
}

@Type()
export class Circle extends Shape
{
    @Property(Number) public radius: number;
}
```

Some other class declares a `shapes` property in it.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class Plot
{
    @Property(Array, [Shape]) public shapes: Shape[];
}
```

From the perspective of declaration everything looks ok but from the point of serialization some things may become complicated. Shapes property can store `Rectangle`, `Square` or `Circle`. Each of this classes have different properties. Here is an example of JSON.

```json
{
    "shapes": [
        {
            "title": "Cool rectangle",
            "width": 10,
            "height": 10
        }, 
        {
            "title": "Perfect square",
            "width": 10
        },
        {
            "title": "Simple circle",
            "radius": 6
        }
    ]
}
```

During deserialization of this JSON to a `Plot` class we only aware that all plain objects inside an `Array` are somehow related to a `Shape` type. So any options to handle this?

Luckily we have a `TypeManager`. When you declaring you types using decorators or declarative style it builds inheritance graph between them which can be used during serialization and deserialization.

It uses 2 special configurable type options:

* `Discriminator` which defines a property inside an object which should be used to define a type.
* `Discriminant` which represents a certain `Discriminator` value.

This options have default values if you have not configured them explicitly.

* Default value of discriminator is a `$type`. During deserialization `TypeManager` expects such property to be present inside a polymorphic object.
* Default value of discriminant is a `ClassName` which determined based on the type function.

For proper deserialization of polymorphic types you have to provide such information inside your JSON.

```json
{
    "shapes": [
        {
            "$type": "Rectangle",
            "title": "Cool rectangle",
            "width": 10,
            "height": 10
        }, 
        {
            "$type": "Square",
            "title": "Perfect square",
            "width": 10
        },
        {
            "$type": "Circle",
            "title": "Simple circle",
            "radius": 6
        }
    ]
}
```

Now your JSON will be handled properly and you will get `Rectangle`, `Square` and `Circle` class instances in return.

In some cases your `Discriminator` or `Discriminant` values will not match to our default ones. For example library like [Json.NET](https://www.newtonsoft.com/json) can be used on the backend side to send a response from your API. It uses `$type` property as `Discriminator` and full name of class as `Discriminant`. In such scenario our JSON may look like this.

```json
{
    "shapes": [
        {
            "$type": "Company.Api.Entities.Rectangle",
            "title": "Cool rectangle",
            "width": 10,
            "height": 10
        }, 
        {
            "$type": "Company.Api.Entities.Square",
            "title": "Perfect square",
            "width": 10
        },
        {
            "$type": "Company.Api.Entities.Circle",
            "title": "Simple circle",
            "radius": 6
        }
    ]
}
```

To change `Discriminator` globally you have to use `TypeManager` configure method.

```typescript
import { TypeManagerOptions } from '@dipscope/type-manager';
import { TypeOptionsBase } from '@dipscope/type-manager/core';

const typeOptionsBase: TypeOptionsBase<any> = {
    discriminator: '$customType'
};

const typeManagerOptions: TypeManagerOptions = {
    typeOptionsBase: typeOptionsBase
};

TypeManager.configure(typeManagerOptions);
```

To change `Discriminant` you have to use per type configuration.

```typescript
import { TypeManagerOptions } from '@dipscope/type-manager';
import { TypeFn, TypeOptions, PropertyName, PropertyOptions } from '@dipscope/type-manager/core';

const rectangleOptions: TypeOptions<Rectangle> = {
    discriminant: 'Company.Api.Entities.Rectangle'
};

const squareOptions: TypeOptions<Square> = {
    discriminant: 'Company.Api.Entities.Square'
};

const circleOptions: TypeOptions<Circle> = {
    discriminant: 'Company.Api.Entities.Circle'
};

const typeManagerOptions: TypeManagerOptions = {
    typeOptionsMap: new Map<TypeFn<any>, TypeOptions<any>>(
        [Rectangle, rectangleOptions],
        [Square, squareOptions],
        [Circle, circleOptions]
    )
};

TypeManager.configure(typeManagerOptions);
```

As an alternative you can change `Discriminant` as the following using decorators.

```typescript
import { Type, Property, Discriminant } from '@dipscope/type-manager';

@Type()
@Discriminant('Company.Api.Entities.Shape')
export abstract class Shape
{
    @Property(String) public title: string;
}

@Type()
@Discriminant('Company.Api.Entities.Rectangle')
export class Rectangle extends Shape
{
    @Property(Number) public width: number;
    @Property(Number) public height: number;
}

@Type()
@Discriminant('Company.Api.Entities.Square')
export class Square extends Shape
{
    @Property(Number) public width: number;
}

@Type()
@Discriminant('Company.Api.Entities.Circle')
export class Circle extends Shape
{
    @Property(Number) public radius: number;
}
```

By default `Discriminator` is not preserved inside objects and only used during deserialization. You can change this behavior by enabling preserving of discriminator globally or per type.

```typescript
import { TypeManagerOptions } from '@dipscope/type-manager';
import { TypeOptionsBase } from '@dipscope/type-manager/core';

const typeOptionsBase: TypeOptionsBase<any> = {
    preserveDiscriminator: true
};

const typeManagerOptions: TypeManagerOptions = {
    typeOptionsBase: typeOptionsBase
};

TypeManager.configure(typeManagerOptions);
```

With this option enabled discriminator will be present in output data.

### Configuring naming convention

Naming convention specifies how each declared property of a type should be treated when reading it from JSON. By default names are read as is. Let's assume we have a `User` class in camel case naming convention for properties.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(String) public name: string;
    @Property(Number) public loginCount: number;
    @Property(DateTime) public createdAt: DateTime;
}
```

Our JSON should match the same naming convention to work properly.

```json
[
    {
        "name": "Dmitry",
        "loginCount": 10,
        "createdAt": "2021-02-22T20:15:00.000Z"
    },
    {
        "name": "Alex",
        "loginCount": 25,
        "createdAt": "2021-02-22T21:15:00.000Z"
    },
    {
        "name": "Anna",
        "loginCount": 3,
        "createdAt": "2021-02-22T21:15:23.000Z"
    }
]
```

But what to do if we don't control the JSON naming convention so it comes to us in a snake case?

```json
[
    {
        "name": "Dmitry",
        "login_count": 10,
        "created_at": "2021-02-22T20:15:00.000Z"
    },
    {
        "name": "Alex",
        "login_count": 25,
        "created_at": "2021-02-22T21:15:00.000Z"
    },
    {
        "name": "Anna",
        "login_count": 3,
        "created_at": "2021-02-22T21:15:23.000Z"
    }
]
```

We can still parse such a JSON by specifying an alias for each property but this will become a pain in a while.

```typescript
import { Type, Property, Alias } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(String) public name: string;
    @Property(Number) @Alias('login_count') public loginCount: number;
    @Property(DateTime) @Alias('created_at') public createdAt: DateTime;
}
```

`TypeManager` supports several naming conventions we can use to avoid dealing with aliases.

* Camel case [camelCase];
* Flat case [flatcase];
* Flat upper case [FLATCASE];
* Kebab case [kebab-kase];
* Kebab upper case [KEBAB-CASE];
* Pascal case [PascalCase];
* Snake case [snake_case];
* Snake upper case [SNAKE_CASE];

To set one we have to configure global options.

```typescript
import { TypeManagerOptions } from '@dipscope/type-manager';
import { TypeOptionsBase } from '@dipscope/type-manager/core';
import { SnakeCaseNamingConvention } from '@dipscope/type-manager/naming-conventions';

const typeOptionsBase: TypeOptionsBase<any> = {
    namingConvention: new SnakeCaseNamingConvention()
};

const typeManagerOptions: TypeManagerOptions = {
    typeOptionsBase: typeOptionsBase
};

TypeManager.configure(typeManagerOptions);
```

Now all property names will be converted to snake case while reading them from JSON. If you have not found suitable naming convention you can easily implement your own. Read more about [creating a custom naming convention](#defining-custom-naming-convention) in a separate section.

### Configuring reference handler

Reference handler defines how references to the same objects including a circular one should be treated. We have several reference handlers: direct, lead and path. Each of them can be used globally or per type.

* Direct reference handler preserves object references without making any special changes;
* Path reference handler preserves object references using JSONPath notation;
* Lead reference handler preserves object references excluding a circular one. When circular reference is detected it will be set to undefined;

There is nothing better to show the difference than code. For example we have two classes which reference each other:

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
class User
{
    @Property(() => Company) public company: Company;
}

@Type()
class Company
{
    @Property(() => User) public user: User;
}
```

Somewhere in code you have such a logic:

```typescript
import { TypeManager } from '@dipscope/type-manager';

const user = new User();
const company = new Company();

user.company = company;
company.user = user;

const result = TypeManager.serialize(User, user);
```

Here are results returned by different reference handlers:

```typescript
// Direct reference handler...
{ company: { user: result } };

// Path reference handler...
{ company: { user: { $ref: '$' } } };

// Lead reference handler...
{ company: { user: undefined };
```

As you can see `DirectReferenceHandler` does not make changes to your data and completely fine until you have to convert circular reference structure to a string. `JSON.stringify` method which we are using under the hood does not support such conversions so you will encounter an error. In this case you can select another reference handler. For example `PathReferenceHandler` which produces JSON string using JSONPath format for circular references supported by many libraries. Or you can simply ignore circular reference when it should be converted to a string and use `LeadReferenceHandler`. To change default reference handler you have to use `TypeManager` configure methods.

```typescript
import { TypeManagerOptions } from '@dipscope/type-manager';
import { TypeOptionsBase } from '@dipscope/type-manager/core';
import { PathReferenceHandler } from '@dipscope/type-manager/reference-handlers';

const typeOptionsBase: TypeOptionsBase<any> = {
    referenceHandler: new PathReferenceHandler()
};

const typeManagerOptions: TypeManagerOptions = {
    typeOptionsBase: typeOptionsBase
};

TypeManager.configure(typeManagerOptions);
```

With such configuration any reference will be handled using JSONPath so you are completely free from errors during conversion to a string.

## Advanced usage

Our goal is to cover as much use cases as possible without making you to write additional code but there always be an application specific case. With that in mind we allow you to customize and extend each part of our pipeline.

### Defining custom data

You can attach you custom metadata to our decorators using `customData` option available on `Type` and `Property`. 

```typescript
import { Type, Property, CustomData } from '@dipscope/type-manager';

@Type()
@CustomData({ rank: 1 })
class User
{
    @Property(String) @CustomData({ priority: 10 }) public name: string;
}
```

This allows you to get it later in serializers, factories, injectors or your code and perform specific actions. Besides pipeline you can get this data in any place you want using `TypeManager`.

```typescript
import { TypeManager } from '@dipscope/type-manager';

const userMetadata = TypeManager.extractTypeMetadata(User);
const customData = userMetadata.customData;

// Do something with type custom data...

for (const propertyMetadata of userMetadata.propertyMetadataMap.values())
{
    const propertyCustomData = propertyMetadata.customData;

    // Do something with property custom data...
}
```

### Defining custom serializer

You can create your own serializer or replace built in one. First you have to implement `Serializer` interface. It declares `serialize` and `deserialize` methods. Serialize method is called during conversion of `JavaScript` object instance into a plain object. Deserialize method is called during backward conversion. Here is an example of possible definition for custom `DateTime` class.

```typescript
import { Serializer, TypeLike, SerializerContext, Fn } from '@dipscope/type-manager/core';

export class DateTimeSerializer implements Serializer<DateTime>
{
    public serialize(x: TypeLike<DateTime>, serializerContext: SerializerContext<DateTime>): TypeLike<string>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.serializedDefaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isDateTime(x))
        {
            return x.toIsoString();
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot serialize value as date time!`, x);
        }

        return undefined;
    }

    public deserialize(x: TypeLike<string>, serializerContext: SerializerContext<DateTime>): TypeLike<DateTime>
    {
        if (Fn.isUndefined(x))
        {
            return serializerContext.deserializedDefaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isString(x))
        {
            return DateTime.fromIsoString(x);
        }

        if (serializerContext.log.errorEnabled) 
        {
            serializerContext.log.error(`${serializerContext.path}: Cannot deserialize value as date time!`, x);
        }

        return undefined;
    }
}
```

This example follows internal conventions and gives you a picture of how real serializer may look like. `TypeManager` does not perform any checks and just passes values directly to serializer. Thats why input values can be undefined, null or others depending from what is stored inside certain property. `TypeLike` is an internal type to declare this behaviour. 

Serializer implementation is fully responsible for return result. You can get default values, custom data and other options specified in configuration from current serializer context and react accordingly. For example you can check if implicit conversion is enabled and convert any value to the target one.

When you are finished with definitions there are two possible ways to register a serializer. You can use decorators.

```typescript
import { Type, Serializer } from '@dipscope/type-manager';

@Type()
@Serializer(new DateTimeSerializer())
export class DateTime
{
    ...
}
```

Or declarative configuration.

```typescript
import { TypeManager } from '@dipscope/type-manager';

TypeManager.configureTypeOptions(DateTime, {
    alias: 'DateTime',
    serializer: new DateTimeSerializer()
});
```

With declarative configuration it is possible to override built in serializers if it's behaviour not suitable for your use cases. Also you can register serializers for types we not yet cover.

### Defining custom injector

In modern world we are always use some kind of framework to build our application. It is definitely already have a configured dependency injection container so let's configure `TypeManager` for using it instead of build in one. You have to implement `Injector` interface with only one method. Here how it may look like in `Angular`.

```typescript
import { Injector, TypeMetadata } from '@dipscope/type-manager/core';
import { Injector as AngularInjector } from '@angular/core';

export class CustomInjector implements Injector
{
    private readonly angularInjector: AngularInjector;

    public constructor(angularInjector: AngularInjector)
    {
        this.angularInjector = angularInjector;

        return;
    }

    public get<TType>(typeMetadata: TypeMetadata<TType>): TType | undefined
    {
        return this.angularInjector.get(typeMetadata.typeFn);
    }
}
```

In general you have to get framework injector or create it manually. Then call method to get and instance by type when one is requested. Implementations can differ but we hope idea is clear. When you are finished with definitions you have to register custom injector for a `TypeManager`.

```typescript
import { TypeManager } from '@dipscope/type-manager';
import { Injector as AngularInjector } from '@angular/core';

const angularInjector: AngularInjector = ...; // Get framework injector in core module for example.

TypeManager.configureTypeOptionsBase({
    injector: new CustomInjector(angularInjector)
});
```

Now types will be resolved using framework injector.

### Defining custom factory

When you want to apply additional logic to how types are constructed you can specify custom factory globally or per type. Let's say you want to init some properties based on your custom data specified for a type. You can do this by extending default `TypeFactory`.

```typescript
import { TypeContext, Injector } from '@dipscope/type-manager/core';
import { TypeFactory } from '@dipscope/type-manager/factories';

export class CustomTypeFactory extends TypeFactory
{
    public build<TType>(typeContext: TypeContext<TType>, injector: Injector): TType
    {
        // Build any type.
        const type = super.build(typeContext, injector) as any;
        
        // Resolve custom data.
        const typeMetadata = typeContext.typeMetadata;
        const customData = typeMetadata.customData;

        // Process custom data.
        for (const propertyName in customData)
        {
            type[propertyName] = customData[propertyName];
        }

        return type;
    }
}
```

When you are finished with definitions there are two possible ways to register a factory. You can use decorators.

```typescript
import { Type, Factory, CustomData } from '@dipscope/type-manager';

@Type()
@CustomData({ rank: 1 })
@Factory(new CustomTypeFactory())
export class User
{
    ...
}
```

Or declarative configuration.

```typescript
import { TypeManager } from '@dipscope/type-manager';

// Overriding only for user type.
TypeManager.configureTypeOptions(User, {
    customData: { rank: 1 },
    factory: new CustomTypeFactory()
});

// Overriding for any type.
TypeManager.configureTypeOptionsBase({
    factory: new CustomTypeFactory()
});
```

### Defining custom naming convention

To define custom naming convention you have to implement `NamingConvention` interface with only one `convert` method. Here is an example implementation of camel case naming convention.

```typescript
import { NamingConvention, Fn } from '@dipscope/type-manager/core';

export class CamelCaseNamingConvention implements NamingConvention
{
    public convert(name: string): string
    {
        return Fn.words(name).reduce(this.reduce, '');
    }

    private reduce(result: string, word: string, index: number): string
    {
        if (word.length === 0)
        {
            return result;
        }

        const wordLowerCased = word.toLowerCase();

        if (index === 0)
        {
            return wordLowerCased;
        }

        return `${result}${wordLowerCased[0].toUpperCase()}${wordLowerCased.slice(1)}`;
    }
}
```

Public `convert` method receives a property name as it declared in a class. You have to call internal `Fn.words` function on it which will split property name into array of the words. In the `reduce` function you can combine this words to whatever string you want. When you are finished with definitions you have to register custom naming convention for a `TypeManager`.

```typescript
import { TypeManager } from '@dipscope/type-manager';

TypeManager.configureTypeOptionsBase({
    namingConvention: new CamelCaseNamingConvention()
});
```

Now property names will be resolved using your custom naming convention.

## Use cases

This section describes certain use cases to separate them from the main documentation part. We will point to a concrete place you should read to setup what is necessary.

### Built in serializers

Here is a list of types with built in serializers. 

* Array;
* ArrayBuffer;
* Boolean;
* DataView;
* Date;
* Float32Array;
* Float64Array;
* Int8Array;
* Int16Array;
* Int32Array;
* Map;
* Number;
* Set;
* String;
* Uint8Array;
* Uint8ClampedArray;
* Uint16Array;
* Uint32Array;

For these you don't have to do anything to make them work. You are free to [create a custom serializer](#defining-custom-serializer) or override built in one if it does not cover your use case.

### Circular object references

We have a great support for circular references with different behaviour when they are detected. Read [configuring reference handler](#configuring-reference-handler) section for more info.

### Dependency injection and immutable types

Follow the steps described in [inject decorator](#inject-decorator) section. To integrate our injection system with you yours check [defining custom injector](#defining-custom-injector) section.

### Different case usage in class and JSON

If your cases differs between class and JSON. For example `camelCase` vs `snake_case`. You can setup naming convention to use during serialization and deserialization. Follow the steps described in [configuring naming convention](#configuring-naming-convention) section.

### Enum types

Enum types are supported but require special handling. This is because of how enums are represented after compiling them to `JavaScript`. You can know more about how to define them in a [property decorator](#property-decorator) section. If you are interested about the `Enum` compilation details you can check the official [documentation](https://www.typescriptlang.org/docs/handbook/enums.html).

### Generic types

Generic types are supported and you can define them. Read [property decorator](#property-decorator) section for more info.

### Integration with Angular

With `Angular` you do not need to install [reflect-metadata](https://github.com/rbuckton/reflect-metadata) as it is already included in `core-js`. However, you still need to instruct CLI to include it in the build. This can be achieved simply by adding `import 'reflect-metadata';` to you `main.ts` file.

To make `Angular` injector work for you a custom `Injector` needs to be implemented. Check [defining custom injector](#defining-custom-injector) section for more info.

### Polymorphic types

Polymorphic types are supported. In most cases additional configuration is required. Check [configuring usage of polymorphic types](#configuring-usage-of-polymorphic-types) section for more info.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the versions section on [NPM project page](https://www.npmjs.com/package/@dipscope/type-manager).

See information about breaking changes, release notes and migration steps between versions in [CHANGELOG.md](https://github.com/dipscope/TypeManager.TS/blob/master/CHANGELOG.md) file.

## Contributing

Please read [CONTRIBUTING.md](https://github.com/dipscope/TypeManager.TS/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Dmitry Pimonov** - *Initial work* - [dpimonov](https://github.com/dpimonov)

See also the list of [contributors](https://github.com/dipscope/TypeManager.TS/contributors) who participated in this project.

## Notes

Thanks for checking this package.

Feel free to create an issue if you find any mistakes in documentation or have any improvements in mind.

We wish you good luck and happy coding!

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE.md](https://github.com/dipscope/TypeManager.TS/LICENSE.md) file for details.

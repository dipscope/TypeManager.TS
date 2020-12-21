# TypeManager.TS

Type manager is a parsing package for TypeScript which will help you to transform JSON strings or plain objects into typed object instances. It supports [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) or declarative configuration and allows you to configure parsing of your or 3rd party classes easily.

## How it works?

It defines configuration for each object which you are going to serialize or deserialize and uses this configuration to process data of your choice. There are two possible ways to define a configuration:

* Using decorator annotations;
* Using declarative configuration;

The first one is the easiest and can be used for any class you control. If you want to configure serialization of 3rd party clases it is better to go with the second. There are no restrictions to use one or another. You can combine two ways of configuration depending on which one fits better.

## Installation

`TypeManager.TS` is available from NPM, both for browser (e.g. using webpack) and NodeJS:

```
npm install @dipscope/type-manager
```

TypeScript needs to run with the `experimentalDecorators` and `emitDecoratorMetadata` options enabled. So make sure you have properly configured your `tsconfig.json` file.

_This package has no dependencies. If you want additional type-safety and reduced syntax you may wish to install [reflect-metadata](https://github.com/rbuckton/reflect-metadata). This step is on your choice and fully optional. When installed it must be available globally to work. This can usually be done with `import 'reflect-metadata';` in your main index file._

## Defining decorators

 We have plenty of decorators. Each of them will be described in details but let's start from the most simple example of configuration.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property() public name: string;
    @Property() public email: string;
}
```

Here we have a `User` class with `Type` and `Property` decorators assigned to it. `Type` decorator declares a type. `Property` decorator describes available properties for that type. To process some data you should create an instance of `TypeManager` and provide a class you want to work with as it's first argument. In our case this is a `User` class.

```typescript
const userManager = new TypeManager(User);
const userObject  = userManager.serialize(new User());
const user        = userManager.deserialize(userObject);

user instanceof User; // True.
```

Calling serialize creates a plain object and deserialize creates an instance of `User` class. During deserialize you can provide any object. It's not nesassary that object was produced by type manager. Objects are parsed based on general type configurations defined by developer.

### Type decorator

Type decorator defines a type and should be declared right before a class.

```typescript
@Type()
export class User
{
    ...
}
```

This will register a new type with default object serializer assigned to it. You can define how each class should be treated by providing optional configure options as a first argument.

```typescript
@Type({
    alias: 'User',
    typeSerializer: new UserSerializer()
})
export class User
{
    ...
}
```

This call defines a type alias which can be later used to resolve a type for a property at runtime. We will talk about details in the next section. Also we defined custom serializer for a type which should be implementation of `TypeSerializer` interface. This serializer will be used later to serialize and deserialize a type including all custom logic of your choice.

There are more options can be provided, so check `TypeOptions` definition.

### Property decorator

Property decorator defined per property configuration within a type and should be declared right before a property definition.

```typescript
@Type()
export class User
{
    @Property() public name: string;
}
```

This will register a `name` property for a `User`. Each property has a type associated with it. In our case this is a `string`. By default if no configure options are provided decorator will try to resolve a property type using [reflect-metadata](https://github.com/rbuckton/reflect-metadata). If you are not using reflect metadata decorators then such configuration will result a property type to be unknown and it will be serialized and deserialized directly. In some cases this can be desired behaviour but in others not. Depending on your case there are two possible ways to configure the property options.

If you are using [reflect-metadata](https://github.com/rbuckton/reflect-metadata) or your are fine with direct serialization then provide an options as a first argument.

```typescript
@Type()
export class User
{
    @Property({ alias: 'username' }) public name: string;
}
```

If property type cannot be resolved automatically but you are still want to use concrete serializers provide a type resolver as a first argument and optional configure options as second.

```typescript
@Type()
export class User
{
    @Property(() => String, { alias: 'username' }) public name: string;
}
```

This explicitly defines a `String` property type for `name` to be string and configure to use `username` property when deserializing from object. 

There are plenty of configure options, so check `PropertyOptions` definition. For example you can make some properties serializable only or define custom property serialization.

### Handling relations

Handling relation types not differs from built in property types, so if you are using [reflect-metadata](https://github.com/rbuckton/reflect-metadata) the definition can be the following.

```typescript
@Type()
export class UserStatus
{
    @Property() public name: string;
    @Property() public title: string;
}

@Type()
export class User
{
    @Property() public name: string;
    @Property() public userStatus: UserStatus;
}
```

Array relations will be handled the same way.

```typescript
@Type()
export class User
{
    @Property() public name: string;
    @Property() public userStatuses: UserStatus[];
}
```

If types cannot be resolved then the most simple definition will be the following.

```typescript
@Type()
export class UserStatus
{
    @Property() public name: string;
    @Property() public title: string;
}

@Type()
export class User
{
    @Property() public name: string;
    @Property(() => UserStatus) public userStatus: UserStatus;
}
```

If any type defines an alias - it can be used as a type resolver.

```typescript
@Type({
    alias: 'UserStatus'
})
export class UserStatus
{
    @Property() public name: string;
    @Property() public title: string;
}

@Type()
export class User
{
    @Property() public name: string;
    @Property('UserStatus') public userStatus: UserStatus;
}
```

Type aliases are useful to handle circular references if you are declaring your types in a separate files.

## Defining helper decorators

`Type` and `Property` decorators provide full configuration for your classes using configure options but there is a way to define this extra options using decorators if you want.

### Alias decorator

To define an alias as configure option you can use `Alias` decorator. It can be used both on class and a property.

```typescript
@Type()
@Alias('User')
export class User
{
    @Property() @Alias('username') public name: string;
}
```

### Serializer decorator

Serializer decorator is used to define custom serializer for your type or property. Serializer should be implementation of `TypeSerializer` interface.

```typescript
@Type()
@Serializer(new UserSerializer())
export class User
{
    @Property() @Serializer(new UserNameSerializer()) public name: string;
}
```

### Serializable and deserializable decorator.

This two used to enable or disable serialization for a certain property.

```typescript
@Type()
export class User
{
    @Property() @Serializable() public name: string;
    @Property() @Deserializable() public email: string;
}
```

## Defining configuration without decorators

There are circumstances when decorators cannot be used. For example you are using a 3rd party package and cannot decorate classes from it. In this case you can define the complete configuration through special static configure method.

```typescript
const dateTimeOptions: TypeOptions = {
    alias: 'DateTime',
    typeSerializer: new DateTimeSerializer()
};

const userOptions: TypeOptions = {
    alias: 'User',
    propertyOptionsMap: new Map<string, PropertyOptions>(
        ['name', { serializable: true, alias: 'username' }],
        ['createdAt', { typeResolver: () => DateTime }]
    )
};

const typeManagerOptions: TypeManagerOptions = {
    typeOptionsMap: new Map<TypeCtor, TypeOptions>(
        [DateTime, dateTimeOptions],
        [User, userOptions]
    )
};

TypeManager.configure(typeManagerOptions);
```

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
@Type()
export class User
{
    @Property() public name: string;
    @Property() public createdAt: DateTime;
}
```

And without [reflect-metadata](https://github.com/rbuckton/reflect-metadata).

```typescript
@Type()
export class User
{
    @Property(() => String) public name: string;
    @Property(() => DateTime) public createdAt: DateTime;
}
``` 

## Using with Angular

With Angular you do not need to install `reflect-metadata` as it is already included in `core-js`. However, you still need to instruct CLI to include it in the build. This can be achieved simply by adding `import 'core-js/proposals/reflect-metadata';` to you `polyfills.ts` file.

## License

`TypeManager.TS` is licensed under the Apache 2.0 License.

<!-- TODO:...
* Write tests for cases below.
* Describe stringify, parse methods in type manager.
* Describe implicit conversion feature.
* Describe custom serializer and related methods.
* Describe default values and usage.
* Describe function possible for default value initializer.
* Describe global type configuration, type options and property ones.
-->

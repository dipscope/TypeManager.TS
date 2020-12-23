# TypeManager.TS

![GitHub](https://img.shields.io/github/license/dipscope/TypeManager.TS) ![NPM](https://img.shields.io/npm/v/@dipscope/type-manager)

Type manager is a parsing package for TypeScript which will help you to transform JSON strings or plain objects into typed object instances. It supports [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) or declarative configuration and allows you to configure parsing of your or 3rd party classes easily.

## Table of contents

* [How it works?](#how-it-works)
* [Installation](#installation)
* [Defining decorators](#defining-decorators)
    * [Type decorator](#type-decorator)
    * [Property decorator](#property-decorator)
    * [Handling relations](#handling-relations)
* [Defining helper decorators](#defining-helper-decorators)
    * [Alias decorator](#alias-decorator)
    * [Serializer decorator](#serializer-decorator)
    * [Serializable and deserializable decorator](#serializable-and-deserializable-decorator)
    * [Multiple decorator](#multiple-decorator)
    * [Default value decorator](#default-value-decorator)
    * [Use default value decorator](#use-default-value-decorator)
    * [Use implicit conversion decorator](#use-implicit-conversion-decorator)
* [Defining configuration without decorators](#defining-configuration-without-decorators)
    * [Configuring global options](#configuring-global-options)
    * [Configuring type options manually](#configuring-type-options-manually)
* [Defining custom type serializer](#defining-custom-type-serializer)
* [Using with Angular](#using-with-angular)
* [License](#license)

## How it works?

It defines configuration for each object which you are going to serialize or deserialize and uses this configuration to process data of your choice. There are two possible ways to define a configuration:

* Using decorator annotations;
* Using declarative configuration;

The first one is the easiest and can be used for any class you control. If you want to configure serialization of 3rd party clases or global options it is better to go with the second. There are no restrictions to use one or another. You can combine two ways of configuration depending on which one fits better.

## Installation

`TypeManager.TS` is available from NPM, both for browser (e.g. using webpack) and NodeJS:

```
npm install @dipscope/type-manager
```

TypeScript needs to run with the `experimentalDecorators` and `emitDecoratorMetadata` options enabled when using decorator annotations. So make sure you have properly configured your `tsconfig.json` file.

_This package has no dependencies. If you want additional type-safety and reduced syntax you may wish to install [reflect-metadata](https://github.com/rbuckton/reflect-metadata). This step is on your choice and fully optional. When installed it must be available globally to work. This can usually be done with `import 'reflect-metadata';` in your main index file._

## Defining decorators

 We have plenty of decorators. Each of them will be described in details but let's start from the most simple example of configuration.

```typescript
import 'reflect-metadata';
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

Calling serialize creates a plain object and deserialize creates an instance of `User` class. During deserialize you can provide any object. It's not nesassary that object was produced by type manager. Objects are parsed based on general type configurations defined by developer. It is also possible to stringify and parse JSON.

```typescript
const userManager = new TypeManager(User);
const userJson    = userManager.stringify(new User());
const user        = userManager.parse(userJson);

user instanceof User; // True.
```

Stringify and parse functions are wrappers over native JSON class functions. In addition they add serialize and deserialize support under the hood.

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

This will register a new type with default object serializer assigned to it. You can define how each class should be treated by providing optional configure options as a first argument.

```typescript
import { Type } from '@dipscope/type-manager';

@Type({
    alias: 'User',
    typeSerializer: new UserSerializer()
})
export class User
{
    ...
}
```

This call defines a type alias which can be later used to resolve a type for a property at runtime. We will talk about details in the next section. Also we defined custom serializer for a type which is derived from `TypeSerializer` class. This serializer will be used later to serialize and deserialize a type including all custom logic of your choice.

There are more options can be provided, so check `TypeOptions` definition or section with helper decorators below.

### Property decorator

Property decorator defined per property configuration within a type and should be declared right before a property definition.

```typescript
import 'reflect-metadata';
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property() public name: string;
}
```

This will register a `name` property for a `User`. Each property has a type associated with it. In our case this is a `string`. By default if no configure options are provided decorator will try to resolve a property type using [reflect-metadata](https://github.com/rbuckton/reflect-metadata). If you are not using reflect metadata decorators then such configuration will result a property type to be unknown and it will be serialized and deserialized directly. In some cases this can be desired behaviour but in others not. Depending on your case there are two possible ways to configure the property options.

If you are using [reflect-metadata](https://github.com/rbuckton/reflect-metadata) or your are fine with direct serialization then provide an options as a first argument.

```typescript
import 'reflect-metadata';
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property({ alias: 'username' }) public name: string;
}
```

If property type cannot be resolved automatically but you are still want to use concrete serializers provide a type resolver as a first argument and optional configure options as second.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(() => String, { alias: 'username' }) public name: string;
}
```

This explicitly defines a `String` property type for `name` to be string and configure to use `username` property when deserializing from object. 

There are plenty of configure options, so check `PropertyOptions` definition or section with helper decorators below. For example you can make some properties serializable only or define custom property serialization.

### Handling relations

Handling relation types not differs from built in property types, so if you are using [reflect-metadata](https://github.com/rbuckton/reflect-metadata) the definition can be the following.

```typescript
import 'reflect-metadata';
import { Type, Property } from '@dipscope/type-manager';

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

Array relations should always declare a type resolver as reflect metadata return type is an array.

```typescript
import 'reflect-metadata';
import { Type, Property } from '@dipscope/type-manager';

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
    @Property(() => UserStatus) public userStatuses: UserStatus[];
}
```

If types cannot be resolved then the most simple definition will be the following.

```typescript
import { Type, Property } from '@dipscope/type-manager';

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

Note that in this case all properties without type resolvers will be handled directly. If you want absolutely the same behaviour as with reflect metadata then you have to define complete configuration.

```typescript
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class UserStatus
{
    @Property(() => String) public name: string;
    @Property(() => String) public title: string;
}

@Type()
export class User
{
    @Property(() => String) public name: string;
    @Property(() => UserStatus) public userStatus: UserStatus;
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
    @Property(() => String) public name: string;
    @Property(() => String) public title: string;
}

@Type()
export class User
{
    @Property(() => String) public name: string;
    @Property('UserStatus') public userStatus: UserStatus;
}
```

Type aliases are useful to handle circular references if you are declaring your types in a separate files.

## Defining helper decorators

`Type` and `Property` decorators provide full configuration for your classes using configure options but there is a way to define this extra options using decorators if you want.

### Alias decorator

To define an alias as configure option you can use `Alias` decorator. It can be used both on class and a property.

```typescript
import { Type, Property, Alias } from '@dipscope/type-manager';

@Type()
@Alias('User')
export class User
{
    @Property() @Alias('username') public name: string;
}
```

### Serializer decorator

Serializer decorator is used to define custom serializer for your type or property. Custom serializer should be derived from `TypeSerializer` class. There is a section below with steps to define custom serializers.

```typescript
import { Type, Property, Serializer } from '@dipscope/type-manager';

@Type()
@Serializer(new UserSerializer())
export class User
{
    @Property() @Serializer(new UserNameSerializer()) public name: string;
}
```

### Serializable and deserializable decorator

This two used to enable or disable serialization for a certain property.

```typescript
import { Type, Property, Serializable, Deserializable } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property() @Serializable() public name: string;
    @Property() @Deserializable() public email: string;
}
```

### Multiple decorator

This decorator used to indicate that certain property is an array when using without reflect metadata.

```typescript
import { Type, Property, Multiple } from '@dipscope/type-manager';

@Type()
export class UserStatus
{
    @Property(() => String) public name: string;
    @Property(() => String) public title: string;
}

@Type()
export class User
{
    @Property(() => String) public name: string;
    @Property(() => UserStatus) @Multiple() public userStatuses: UserStatus[];
}
```

### Default value decorator

This decorator is used to define a default value when one is undefined. It can be used on type or property.

```typescript
import { Type, Property, DefaultValue } from '@dipscope/type-manager';

@Type()
@DefaultValue(() => new User())
export class User
{
    @Property() @DefaultValue('BestName') public name: string;
}
```

As you can see it accepts an arrow function or a certain value. Both are valid for type and property. Using default values is turned off by default. You can enable them using `UseDefaultValue` decorator per type and property or enable globally using `TypeManager` configure method.

### Use default value decorator

This decorator enables or disables using default value per type or property.

```typescript
import { Type, Property, UseDefaultValue } from '@dipscope/type-manager';

@Type()
@UseDefaultValue()
export class User
{
    @Property() @UseDefaultValue(false) public name: string;
}
```

### Use implicit conversion decorator

By default if declared type will not match provided during serialization or deserialization - an error will be logged and result value will be undefined. This means that for example assigning `number` to `string` will not work as `StringSerializer` expects `string`. However `number` and other types can be converted to `string` for you when implicit conversion is enabled.

```typescript
import { Type, Property, UseImplicitConversion } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property() @UseImplicitConversion() public name: string;
}
```

With this any value which can be converted to `string` will be converted properly. Such behaviour works for other built in serializers and supported for custom ones. By default implicit conversion is turned off. You can enable it using `UseImplicitConversion` decorator per type and property or enable globally using `TypeManager` configure method.

## Defining configuration without decorators

There are circumstances when decorators cannot be used. For example you are using a 3rd party package and cannot decorate classes from it. Another use case - you want to configure some options globally. In this case you can define the complete configuration through special static configure method.

### Configuring global options

There are several options which can be configured globally.

```typescript
const typeOptionsBase: TypeOptionsBase = {
    defaultValue: null,
    useDefaultValue: true,
    useImplicitConversion: true
};

const typeManagerOptions: TypeManagerOptions = {
    typeOptionsBase: typeOptionsBase
};

TypeManager.configure(typeManagerOptions);
```

This will override default options and you don't have to specify them explicitly per type or property.

### Configuring type options manually

Here is an example of declarative configuration which can be used for 3rd party or your own classes if you cannot use decorators for some reason. Each type configuration will override global options.

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
    @Property(() => String) public name: string;
    @Property(() => DateTime) public createdAt: DateTime;
}
``` 

## Defining custom type serializer

You can create your own serializer or replace built in one. First you have to extend `TypeSerializer` and implement required `serialize` and `deserialize` methods. Here is an example of possible definition for custom `DateTime` class.

```typescript
import { TypeSerializer } from '@dipscope/type-manager';

export class DateTimeSerializer extends TypeSerializer
{
    public serialize(x: DateTime): string
    {
        return x.toIsoString();
    }

    public deserialize(x: string): DateTime
    {
        return DateTime.fromIsoString(x);
    }
}
``` 

Optionally you can implement `convert` method which called when implicit conversion is enabled. You should check if some value can be converted to `DateTime` if not - return original value without any changes.

```typescript
import { TypeSerializer } from '@dipscope/type-manager';

export class DateTimeSerializer extends TypeSerializer
{
    ...

    public convert(x: any): DateTime
    {
        if (typeof x === 'number')
        {
            return DateTime.fromMilliseconds(x);
        }

        return x;
    }
}
```

Then there are two possible ways to register a type serializer. You can use decorators.

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
const dateTimeOptions: TypeOptions = {
    alias: 'DateTime',
    typeSerializer: new DateTimeSerializer()
};

const typeManagerOptions: TypeManagerOptions = {
    typeOptionsMap: new Map<TypeCtor, TypeOptions>(
        [DateTime, dateTimeOptions]
    )
};

TypeManager.configure(typeManagerOptions);
```

With declarative configuration it is possible to override built in serializers if it's behaviour not suitable for your use cases.

## Using with Angular

With Angular you do not need to install `reflect-metadata` as it is already included in `core-js`. However, you still need to instruct CLI to include it in the build. This can be achieved simply by adding `import 'core-js/proposals/reflect-metadata';` to you `polyfills.ts` file.

## License

`TypeManager.TS` is licensed under the Apache 2.0 License.

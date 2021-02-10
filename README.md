# TypeManager.TS

![GitHub](https://img.shields.io/github/license/dipscope/TypeManager.TS) ![NPM](https://img.shields.io/npm/v/@dipscope/type-manager)

Type manager is a parsing package for TypeScript which will help you to transform JSON strings or plain objects into typed object instances. It supports [decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) or declarative configuration and allows you to configure parsing of your or 3rd party classes easily.

## Table of contents

* [How it works?](#how-it-works)
* [Installation](#installation)
* [Defining decorators](#defining-decorators)
    * [Type decorator](#type-decorator)
    * [Property decorator](#property-decorator)
    * [Inject decorator](#inject-decorator)
* [Defining helper decorators](#defining-helper-decorators)
    * [Alias decorator](#alias-decorator)
    * [Custom data decorator](#custom-data-decorator)
    * [Type factory decorator](#type-factory-decorator)
    * [Type serializer decorator](#type-serializer-decorator)
    * [Type injector decorator](#type-injector-decorator)
    * [Injectable decorator](#injectable-decorator)
    * [Serializable and deserializable decorator](#serializable-and-deserializable-decorator)
    * [Multiple decorator](#multiple-decorator)
    * [Default value decorator](#default-value-decorator)
    * [Use default value decorator](#use-default-value-decorator)
    * [Use implicit conversion decorator](#use-implicit-conversion-decorator)
* [Defining configuration without decorators](#defining-configuration-without-decorators)
    * [Configuring global options](#configuring-global-options)
    * [Configuring options per type](#configuring-options-per-type)
* [Advanced usage](#advanced-usage)
    * [Defining custom data](#defining-custom-data)
    * [Defining custom type serializer](#defining-custom-type-serializer)
    * [Defining custom type injector](#defining-custom-type-injector)
    * [Defining custom type factory](#defining-custom-type-factory)
* [Use cases](#use-cases)
    * [Dependency injection and immutable types](#dependency-injection-and-immutable-types)
    * [Integration with Angular](#integration-with-angular)
* [Notes](#notes)
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

Here we have a `User` class with `Type` and `Property` decorators assigned to it. `Type` decorator declares a type. `Property` decorator describes available properties for that type. To process something you have to call static method of `TypeManager` with providing a type and data you want to work with.

```typescript
import { TypeManager } from '@dipscope/type-manager';

const userObject = TypeManager.serialize(User, new User());
const user       = TypeManager.deserialize(User, userObject);

user instanceof User; // True.
```

Calling serialize creates a plain object and deserialize creates an instance of `User` class. During deserialize you can provide any object. It's not nesassary that object was produced by type manager. If object is an `Array` you will get array of types in return. Objects are parsed based on general type configuration defined by developer. It is also possible to stringify and parse JSON.

```typescript
import { TypeManager } from '@dipscope/type-manager';

const userJson = TypeManager.stringify(User, new User());
const user     = TypeManager.parse(User, userJson);

user instanceof User; // True.
```

Stringify and parse functions are wrappers over native JSON class functions. In addition they add serialize and deserialize support under the hood.

Static functions are not the only way to work with a `TypeManager`. You can also work on instance based manner. 

```typescript
import { TypeManager } from '@dipscope/type-manager';

const userManager = new TypeManager(User);
const userObject  = userManager.serialize(new User());
const user        = userManager.deserialize(userObject);

user instanceof User; // True.
```

Besides base functionality for serialization and deserialization this allows you to get metadata and preserve configuration state of a type at runtime.

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

This call defines a type alias which can be later used to resolve a type for a property at runtime. We will talk about details in the property decorator section. Also we defined custom serializer for a type which is an implementation of `TypeSerializer` interface. This serializer will be used later to serialize and deserialize a type including all custom logic of your choice. You can read more about [creating a custom type serializer](#defining-custom-type-serializer) in the separate section.

There are more options can be provided for a type, so check `TypeOptions` definition or section with [helper decorators](#defining-helper-decorators) below.

### Property decorator

Property decorator defines per property configuration within a type and should be declared right before a property definition.

```typescript
import 'reflect-metadata';
import { Type, Property } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property() public name: string;
}
```

This will register a `name` property for a `User`. Each property has a type associated with it. In our case this is a `string`. By default if no configure options are provided decorator will try to resolve a property type using [reflect-metadata](https://github.com/rbuckton/reflect-metadata). If you are not using reflect metadata then such configuration will result a property type to be `unknown` and it will be serialized and deserialized directly. In some cases this can be desired behaviour but in others not. Depending on your case there are two possible ways to configure the property options.

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

This explicitly defines a `String` property type for `name` to be string and configure to use `username` property when deserializing from object. There are plenty of configure options, so check `PropertyOptions` definition or section with [helper decorators](#defining-helper-decorators) below. For example you can make some properties serializable only or define custom property serialization.

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

Array relations should always declare a type resolver as reflect metadata return type is an `Array`.

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

### Inject decorator

Inject decorator controls your type dependency and declared right before a constructor parameter.

```typescript
import { Type, Property, Inject } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(() => String) public readonly name: string;

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
    public prop: string;
}
```

In most cases you will work in environment where dependency injection system is already setted up. In this case you have to implement custom `TypeInjector` to be used instead of our default one. Besides you should follow the steps to register injectable services specified by the vendor. This means that you should not use `Injectable` decorator from our package. You can read more about [creating a custom type injector](#defining-custom-type-injector) in the separate section.

If you are using [reflect-metadata](https://github.com/rbuckton/reflect-metadata) the injection of services can be simplified.

```typescript
import { Type, Property, Inject } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property() public readonly name: string;

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

`Type` and `Property` decorators provide full configuration for your classes using configure options but there is a way to define this extra options using decorators if you want.

### Alias decorator

To define an alias you can use `Alias` decorator. It can be used both on class and property. 

```typescript
import { Type, Property } from '@dipscope/type-manager';
import { Alias } from '@dipscope/type-manager/helpers';

@Type()
@Alias('User')
export class User
{
    @Property(() => String) @Alias('username') public name: string;
}
```

Alias defined for a class can be used later for resolving property types. Note that it should be unique within application to work properly.

Alias defined for a property declares that property name differs from one specified in JSON. In our case `username` will be used instead of `name` during JSON serialization and deserialization.

### Custom data decorator

Custom data decorator can be used to provide any custom data for type or property.

```typescript
import { Type, Property } from '@dipscope/type-manager';
import { CustomData } from '@dipscope/type-manager/helpers';

@Type()
@CustomData({ rank: 1 })
export class User
{
    @Property(() => String) public name: string;
}
```

This custom data later can be accessed in serializers, factories or injectors and used accordingly. Read more about [defining custom data](#defining-custom-data) in a separate section.

### Type factory decorator

Type factory decorator can be used to register a handler which should be used for constructing a type instead of default one.

```typescript
import { Type, Property } from '@dipscope/type-manager';
import { TypeFactory } from '@dipscope/type-manager/helpers';

@Type()
@TypeFactory(new UserFactory())
export class User
{
    @Property(() => String) public name: string;
}
```

This may be useful in cases when you want to init some special application specific properties. Read more about [defining custom type factory](#defining-custom-type-factory) in a separate section.

### Type serializer decorator

Type serializer decorator is used to define custom serializer for your type or property. 

```typescript
import { Type, Property } from '@dipscope/type-manager';
import { TypeSerializer } from '@dipscope/type-manager/helpers';

@Type()
@TypeSerializer(new UserSerializer())
export class User
{
    @Property(() => String) @TypeSerializer(new UserNameSerializer()) public name: string;
}
```

Custom serializer should be an implementation of `TypeSerializer` interface. You can read more about [creating a custom type serializer](#defining-custom-type-serializer) in the separate section.

### Type injector decorator

Type injector decorator can be used to define a custom injector implementation which should be used in a type scope.

```typescript
import { Type, Property } from '@dipscope/type-manager';
import { TypeInjector } from '@dipscope/type-manager/helpers';

@Type()
@TypeInjector(new UserInjector())
export class User
{
    @Property(() => String) public name: string;
}
```

In most cases this is not required and the common use case is to specify injector globally instead. You can read more about [defining custom type injector](#defining-custom-type-injector) in the separate section.

### Injectable decorator

Injectable decorator is used to register a type in dependency injection container.

```typescript
import { Injectable } from '@dipscope/type-manager/helpers';

@Injectable()
export class UserService
{
    public prop: string;
}
```

This type later can be provided as a dependency.

```typescript
import { Type, Property, Inject } from '@dipscope/type-manager';

@Type()
export class User
{
    @Property(() => String) public name: string;

    public constructor(@Inject(UserService) userService: UserService)
    {
        // Any action with UserService...

        return;
    }
}
```

In most cases you will work in environment where dependency injection system is already setted up. In this case you have to implement custom `TypeInjector` to be used instead of our default one. Besides you should follow the steps to register injectable services specified by the vendor. This means that you should not use `Injectable` decorator from our package. You can read more about [creating a custom type injector](#defining-custom-type-injector) in the separate section.

### Serializable and deserializable decorator

This two are used to enable or disable serialization for a certain property.

```typescript
import { Type, Property } from '@dipscope/type-manager';
import { Serializable, Deserializable } from '@dipscope/type-manager/helpers';

@Type()
export class User
{
    @Property(() => String) @Serializable() public name: string;
    @Property(() => String) @Deserializable() public email: string;
}
```

By default all properties are serializable and deserializable.

### Multiple decorator

This decorator used to indicate that certain property is an array when using without reflect metadata.

```typescript
import { Type, Property } from '@dipscope/type-manager';
import { Multiple } from '@dipscope/type-manager/helpers';

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

In most cases JSON will be parsed properly even without this option. However when using default values is enabled this may be critical to emit array for undefined property.

### Default value decorator

This decorator is used to define a default value when one is undefined. It can be used on type or property.

```typescript
import { Type, Property } from '@dipscope/type-manager';
import { DefaultValue } from '@dipscope/type-manager/helpers';

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
import { Type, Property } from '@dipscope/type-manager';
import { UseDefaultValue } from '@dipscope/type-manager/helpers';

@Type()
@UseDefaultValue()
export class User
{
    @Property() @UseDefaultValue(false) public name: string;
}
```

Using default values is turned off by default. You can enable them globally using `TypeManager` configure method.

### Use implicit conversion decorator

By default if declared type will not match provided during serialization or deserialization - an error will be logged and result value will be undefined. This means that for example assigning `number` to `string` will not work as `StringSerializer` expects `string`. However `number` and other types can be converted to `string` for you when implicit conversion is enabled.

```typescript
import { Type, Property } from '@dipscope/type-manager';
import { UseImplicitConversion } from '@dipscope/type-manager/helpers';

@Type()
export class User
{
    @Property() @UseImplicitConversion() public name: string;
}
```

With this any value which can be converted to `string` will be converted properly. Such behaviour works for other built in serializers and supported for custom ones. By default implicit conversion is turned off. You can enable it using `UseImplicitConversion` decorator per type and property or enable globally using `TypeManager` configure method.

## Defining configuration without decorators

There are circumstances when decorators cannot be used. For example you are using a 3rd party package and cannot decorate classes from it. Another use case - you want to configure some options globally. In this case you can define the complete configuration through special static configure method. 

There are also exist separate methods to configure each type manager option, so the provided examples can be simplified to avoid creating additional object. It is useful when you need to configure only one option. In our examples we are always use the main one to give you a general overview.

### Configuring global options

There are several options which can be configured globally. For example let's override using of default value option so we don't have to specify it explicitly per type or property.

```typescript
import { TypeManagerOptions, TypeOptionsBase } from '@dipscope/type-manager';

const typeOptionsBase: TypeOptionsBase = {
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
import { TypeManagerOptions, TypeOptions, TypeCtor, PropertyOptions } from '@dipscope/type-manager';

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
    @Property(() => String) public name: string;
    @Property(() => DateTime) public createdAt: DateTime;
}
``` 

## Advanced usage

Our goal is to cover as much use cases as possible without making you to write additional code but there always be an application specific case. With that in mind we allow you to customize and extend each part of our pipeline.

### Defining custom data

You can attach you custom metadata to our decorators using `customData` option available on `Type` and `Property`. 

```typescript
import { Type, Property } from '@dipscope/type-manager';
import { CustomData } from '@dipscope/type-manager/helpers';

@Type()
@CustomData({ rank: 1 })
class User
{
    @Property() @CustomData({ priority: 10 }) public name?: string;
}
```

This allows you to get it later in serializers, factories or injectors and perform specific actions. Besides pipeline you can get this data in any place you want using `TypeManager` instance.

```typescript
import { TypeManager } from '@dipscope/type-manager';

const userManager  = new TypeManager(User);
const userMetadata = userManager.typeMetadata;
const customData   = userMetadata.customData;

// Do something with type custom data...

for (const propertyMetadata of userMetadata.propertyMetadataMap.values())
{
    const propertyCustomData = propertyMetadata.customData;

    // Do something with property custom data...
}
```

### Defining custom type serializer

You can create your own serializer or replace built in one. First you have to implement `TypeSerializer` interface. It declares `serialize` and `deserialize` methods. Serialize method is called during conversion of JS object instance into plain JSON object. Deserialize method is called during backward conversion. Here is an example of possible definition for custom `DateTime` class.

```typescript
import { TypeSerializer, TypeLike, TypeSerializerContext } from '@dipscope/type-manager';
import { Fn, Log } from '@dipscope/type-manager/utils';

export class DateTimeSerializer implements TypeSerializer<DateTime>
{
    public serialize(x: TypeLike<DateTime>, typeSerializerContext: TypeSerializerContext<DateTime>): TypeLike<string>
    {
        if (Fn.isUndefined(x))
        {
            return typeSerializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isDateTime(x))
        {
            return x.toIsoString();
        }

        if (Fn.isArray(x))
        {
            return x.map(v => this.serialize(v, typeSerializerContext));
        }

        if (Log.errorEnabled) 
        {
            Log.error(`${typeSerializerContext.path}: Cannot serialize value as date time!`, x);
        }

        return undefined;
    }

    public deserialize(x: TypeLike<string>, typeSerializerContext: TypeSerializerContext<DateTime>): TypeLike<DateTime>
    {
        if (Fn.isUndefined(x))
        {
            return typeSerializerContext.defaultValue;
        }

        if (Fn.isNull(x))
        {
            return x;
        }

        if (Fn.isString(x))
        {
            return DateTime.fromIsoString(x);
        }
        
        if (Fn.isArray(x))
        {
            return x.map((v: any) => this.deserialize(v, typeSerializerContext));
        }

        if (Log.errorEnabled) 
        {
            Log.error(`${typeSerializerContext.path}: Cannot deserialize value as date time!`, x);
        }

        return undefined;
    }
}
```

This example follows internal conventions and gives you a picture of how real serializer may look like. `TypeManager` does not perform any checks and just passes values directly to serializer. Thats why input values can be undefined, null, array or other depending from what is stored inside certain property. `TypeLike` is an internal type to declare this behaviour. 

Serializer implementation is fully responsible for return result. You can get default values, custom data and other options specified in your configuration from current serializer context and react accordingly. For example you can check if implicit conversion is enabled and convert any value to the target one.

When you are finished with definitions there are two possible ways to register a type serializer. You can use decorators.

```typescript
import { Type } from '@dipscope/type-manager';
import { TypeSerializer } from '@dipscope/type-manager/helpers';

@Type()
@TypeSerializer(new DateTimeSerializer())
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
    typeSerializer: new DateTimeSerializer()
});
```

With declarative configuration it is possible to override built in serializers if it's behaviour not suitable for your use cases. Also you can register serializers for types we not yet cover.

### Defining custom type injector

In modern world we are always use some kind of framework to build our application. It is definitely already have a configured dependency injection container so let's configure `TypeManager` for using it instead of build in one. You have to implement `TypeInjector` interface with only one method. Here how it may look like in `Angular`.

```typescript
import { TypeInjector } from '@dipscope/type-manager';
import { Injector } from '@angular/core';

export class CustomInjector implements TypeInjector
{
    private readonly injector: Injector;

    public constructor(injector: Injector)
    {
        this.injector = injector;

        return;
    }

    public get<TType>(typeMetadata: TypeMetadata<TType>): TType | undefined
    {
        return this.injector.get(typeMetadata.typeCtor);
    }
}
```

In general you have to get framework injector or create it manually. Then call method to get and instance by type when one is requested. Implementations can differ but we hope idea is clear. When you are finished with definitions you have to register custom injector for a `TypeManager`.

```typescript
import { TypeManager } from '@dipscope/type-manager';
import { Injector } from '@angular/core';

const injector: Injector = ...; // Get framework injector in core module for example.

TypeManager.configureTypeOptionsBase({
    typeInjector: new CustomInjector(injector)
});
```

Now types will be resolved using framework injector.

### Defining custom type factory

When you want to apply additional logic to how types are constructed you can specify custom type factory globally or per type. Let's say you want to init some properties based on your custom data specified for a type. You can do this by extending default `ObjectFactory` but let's first look how it may look like if you want implement one from scratch.

```typescript
import { TypeFactory, TypeContext, TypeInjector } from '@dipscope/type-manager';

export class CustomObjectFactory implements TypeFactory<Record<string, any>>
{
    public build(typeContext: TypeContext<Record<string, any>>, typeInjector: TypeInjector): Record<string, any>
    {
        const typeMetadata = typeContext.typeMetadata;
        const typeCtor     = typeMetadata.typeCtor;
        const args         = new Array<any>(typeCtor.length).fill(undefined);

        // Define inject arguments.
        for (const injectMetadata of typeMetadata.injectMetadataMap.values())
        {
            const argKey = injectMetadata.key;

            if (argKey)
            {
                args[injectMetadata.index] = typeContext.get(argKey)?.value;

                continue;
            }

            const argTypeMetadata = injectMetadata.typeMetadata;

            if (argTypeMetadata)
            {
                args[injectMetadata.index] = typeInjector.get(argTypeMetadata);

                continue;
            }
        }

        // Build instance.
        const instance = new typeCtor(...args);

        // Resolve custom data.
        const customData = typeMetadata.customData;

        // Process custom data.
        for (const propertyName in customData)
        {
            instance[propertyName] = customData[customData];
        }

        return instance;
    }
}
```

Resolving constructor arguments and building instance are required steps. However you can do whatever you want. If controlling of injection steps are not required above example can be rewritten as following.

```typescript
import { TypeContext, TypeInjector } from '@dipscope/type-manager';
import { ObjectFactory } from '@dipscope/type-manager/factories';

export class CustomObjectFactory extends ObjectFactory
{
    public build(typeContext: TypeContext<Record<string, any>>, typeInjector: TypeInjector): Record<string, any>
    {
        // Build instance.
        const instance = super.build(typeContext, typeInjector);
        
        // Resolve custom data.
        const typeMetadata = typeContext.typeMetadata;
        const customData   = typeMetadata.customData;

        // Process custom data.
        for (const propertyName in customData)
        {
            instance[propertyName] = customData[customData];
        }

        return instance;
    }
}
```

This will keep you away from controlling injection. 

When you are finished with definitions there are two possible ways to register a type factory. You can use decorators.

```typescript
import { Type } from '@dipscope/type-manager';
import { TypeFactory, CustomData } from '@dipscope/type-manager/helpers';

@Type()
@CustomData({ rank: 1 })
@TypeFactory(new CustomObjectFactory())
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
    typeFactory: new CustomObjectFactory()
});

// Overriding for any type.
TypeManager.configureTypeOptionsBase({
    typeFactory: new CustomObjectFactory()
});
```

## Use cases

This section describes concrete use cases to separate them from the main documentation part. We will point to a concrete place you should read to setup what is necessary.

### Dependency injection and immutable types

Follow the steps described in [inject decorator](#inject-decorator) section. To integrate our injection system with you yours check [defining custom type injector](#defining-custom-type-injector) section.

### Integration with Angular

With `Angular` you do not need to install [reflect-metadata](https://github.com/rbuckton/reflect-metadata) as it is already included in `core-js`. However, you still need to instruct CLI to include it in the build. This can be achieved simply by adding `import 'reflect-metadata';` to you `main.ts` file.

To make `Angular` injector work for you a custom `TypeInjector` needs to be implemented. Check [defining custom type injector](#defining-custom-type-injector) section for more info.

## Notes

Thanks for checking this package. If you like it please give repo a star.

Have any improvements in mind? Feel free to create an issue. 

I wish you good luck and happy coding! ;)

## License

`TypeManager.TS` is licensed under the Apache 2.0 License.

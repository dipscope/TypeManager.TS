# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2021-03-24

### Added

- Polymorphic types support.
- Enums support.
- Accessors support.
- Multiple runtime configurations support.

### Changed

- Newly introduced `TypeFn` is now used instead of `TypeCtor` in configure methods due to adding polymorphic types support.
- Static methods of `TypeManager` now return static instance to enable method chaining.

### Migrating from previous version

- Replace `TypeCtor` with `TypeFn` if you are using declarative configuration.

## [3.0.0] - 2021-03-06

### Added

- Generics support.
- Circular object reference support.
- Short property declaration syntax.
- Naming convention support.
- Module separation.
- New set of serializers.

### Changed

- Core types, interfaces and classes moved to a core module to keep main namespace clean.
- All decorators are now available from the main namespace.

### Fixed

- Invalid implicit conversion of boolean serializer.
- Properties were not assigned during deserialization if they already have initialized value.

### Removed

- Multiple decorator and related options as they are no longer required.

### Migrating from previous version

- Replace all core type and interface imports from `@dipscope/type-manager` to `@dipscope/type-manager/core`.
- Replace all helper decorator imports from `@dipscope/type-manager/helpers` to `@dipscope/type-manager`.
- Change all places where `Property` decorator is used to declare an array of types to a proper generic variant.
- If you are using `TypeSerializer`, `TypeFactory`, `TypeInjector` helper decorators or interfaces then rename them to `Serializer`, `Factory`, `Injector` accordingly.
- If you are using `typeAlias` or `typeResolver` property options replace them to `typeArgument`.

## [2.0.4] - 2021-02-13

### Changed

- Improved type serializer context to avoid instance of call in serializers.

## [2.0.3] - 2021-02-13

### Fixed

- Broken helpers module.

## [2.0.2] - 2021-02-11

### Fixed

- Broken module resolvers.

## [2.0.1] - 2021-02-11

### Fixed

- Broken imports from newly introduced namespaces.

## [2.0.0] - 2021-02-10

### Added

- Dependency injection support.
- Immutable types support.
- Type hint support.
- Custom data support.

### Changed

- Type serializer now an inteface.
- Some helper decorators renamed to match option names.
- Helper decorators moved to their own namespace.

### Migrating from previous version

- Replace extension with implementation for custom type serializers.
- If your custom serializers uses implicit conversion make it part of the serialize and deserialize methods. You can check if it should be used based on newly introduced serializer context.
- If you are using `Serializer` helper decorator then rename it to `TypeSerializer`.
- For all helper decorators change imports to `@dipscope/type-manager/helpers`. Now they are located in their own namespace.

## [1.3.0] - 2021-01-20

### Added

- Type manager methods to configure each option individually.

### Fixed

- Type options were not applied after changes at runtime.

## [1.2.2] - 2020-12-25

### Fixed

- Type error when trying to serialize and deserialize object with null values.
- Explicit deserialization of properties.

## [1.2.1] - 2020-12-24

### Fixed

- Broken exports for browser based applications.

## [1.2.0] - 2020-12-23

### Added

- Multiple property option to indicate that certain property is an array when using without reflect metadata.

### Fixed

- Type extraction using reflect metadata.

## [1.1.0] - 2020-12-22

### Added

- Global type options.
- Default value definition for types and properties.
- Implicit conversion for types and properties.
- Type manager stringify and parse methods for working with JSON.

## [1.0.0] - 2020-12-16

### Added

- Type manager for serializing and deserializing objects.
- Decorator annotations for type and property metadata.
- Declarative configuration for type and property metadata.
- Custom serializer support.
- Reflect metadata support.

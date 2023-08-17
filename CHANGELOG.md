# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [7.1.0] - 2023-08-??

### Added

- Type extension metadata.
- Property extension metadata.

## [7.0.1] - 2023-08-10

### Fixed

- Invalid ES5 lazy type resolvers.

## [7.0.0] - 2023-06-25

### Added

- Strongly typed custom options.
- Performance improvements when using custom options.

### Removed

- Old custom data option.

### Migrating from previous version

- Replace old custom data configurations with newly introduced strongly typed custom options.

## [6.0.0] - 2023-03-22

### Added

- Fluent api for declarative configuration.
- Property metadata sorters.
- Inject metadata sorters.
- Stable json stringify and parse functions.
- Any and unknown type serializers.
- Modules support.
- Performance improvements.

### Changed

- If property type argument is not configured then no error will be thrown and property will be serialized as unknown.
- Weak reference maps changed to regular maps to allow more extension points.
- Reference handler names to be more self descriptive.

### Migrating from previous version

- Replace old declarative configuration calls with newly introduced fluent api.
- You can still use raw declarative api through the options by adapting method calls.

## [5.0.0] - 2022-07-31

### Added

- Preserve null option.
- Performance improvements.

### Changed

- Simplify handling of object references inside serializers.
- Separate modules are now merged into one to reduce final application bundle size and simplify usage.

### Removed

- Helper decorators as they silently increase final application bundle size and reduce performance on startup for the end user.

### Migrating from previous version

- Replace all separate module imports to `@dipscope/type-manager`.
- Remove all helper decorators and use configure options with the same names from the main `Type`, `Property` and `Inject` decorators.

## [4.1.1] - 2022-05-30

### Changed

- Moved source maps into separate file and reduced production bundle size.

## [4.1.0] - 2022-05-18

### Added

- Getters for serialized and deserialized default value in metadata.
- Decorators and options to define serialized and deserialized default value explicitly.

## [4.0.4] - 2022-05-15

### Changed

- Set webpack global output object to `this`.

## [4.0.3] - 2022-05-07

### Added

- Getters of serialized and deserialized property names for property metadata.

### Removed

- Definition logic of serialized and deserialized property names from type serializer.

### Fixed

- Serialized property name was displayed in log messages.

## [4.0.2] - 2022-05-01

### Changed

- Used symbol instead of string based key to store type metadata.
- Avoid complete reset of custom data by providing `null` as argument.
- Code style improvements.

## [4.0.1] - 2021-08-01

### Changed

- Custom data options are now behave like built in configure options.
- Path reference handler is now using path traversal instead of direct evaluation for resolving references.

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

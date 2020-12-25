# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

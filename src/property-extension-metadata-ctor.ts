import { PropertyExtensionMetadata } from './property-extension-metadata';
import { PropertyExtensionOptions } from './property-extension-options';
import { PropertyMetadata } from './property-metadata';

/**
 * Property extension metadata constructor.
 * 
 * @type {PropertyExtensionMetadataCtor<TPropertyExtensionMetadata, TPropertyExtensionOptions, TDeclaringObject, TObject>}
 */
export type PropertyExtensionMetadataCtor<
    TPropertyExtensionMetadata extends PropertyExtensionMetadata<TDeclaringObject, TObject, TPropertyExtensionOptions>, 
    TPropertyExtensionOptions extends PropertyExtensionOptions, 
    TDeclaringObject, 
    TObject
> = new (
    propertyMetadata: PropertyMetadata<TDeclaringObject, TObject>, 
    propertyExtensionOptions: TPropertyExtensionOptions
) => TPropertyExtensionMetadata;

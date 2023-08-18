import { CustomKey } from './custom-key';
import { PropertyExtensionMetadataCtor } from './property-extension-metadata-ctor';

/**
 * Property extension metadata constructor set key.
 * 
 * @type {CustomKey<Set<PropertyExtensionMetadataCtor<any, any, any>>>}
 */
export const propertyExtensionMetadataCtorSetKey: CustomKey<Set<
    PropertyExtensionMetadataCtor<any, any, any, any>
>> = new CustomKey<Set<
    PropertyExtensionMetadataCtor<any, any, any, any>
>>('$DSPropertyExtensionMetadataCtorSet', () => new Set<
    PropertyExtensionMetadataCtor<any, any, any, any>
>());

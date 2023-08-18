import { CustomKey } from './custom-key';
import { TypeExtensionMetadataCtor } from './type-extension-metadata-ctor';

/**
 * Type extension metadata constructor set key.
 * 
 * @type {CustomKey<Set<TypeExtensionMetadataCtor<any, any, any>>>}
 */
export const typeExtensionMetadataCtorSetKey: CustomKey<Set<
    TypeExtensionMetadataCtor<any, any, any>
>> = new CustomKey<Set<
    TypeExtensionMetadataCtor<any, any, any>
>>('$DSTypeExtensionMetadataCtorSet', () => new Set<
    TypeExtensionMetadataCtor<any, any, any>
>());

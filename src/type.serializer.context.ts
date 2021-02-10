import { TypeMetadata } from './type.metadata';
import { PropertyMetadata } from './property.metadata';

/**
 * Type serializer context.
 * 
 * @type {TypeSerializerContext<TType>}
 */
export type TypeSerializerContext<TType> = TypeMetadata<TType> | PropertyMetadata<any, TType>;

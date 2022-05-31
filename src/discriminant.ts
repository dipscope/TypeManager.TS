import { TypeName } from './type-name';

/**
 * Discriminant intends to describe a unique key for a polymorphic type which will be 
 * used during serialization and deserialization. Can be a type name, any string or number.
 * 
 * @type {Discriminant}
 */
export type Discriminant = TypeName | string | number;

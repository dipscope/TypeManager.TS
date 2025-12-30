import { PropertyMetadata } from './property-metadata';
import { TypePrimitive } from './type-primitive';

/**
 * A property interceptor allows injecting custom logic when a value is read or assigned. It 
 * receives the current value and must return the final value that will actually be used by 
 * the property.
 * 
 * @type {PropertyInterceptor<TDeclaringObject, TObject>}
 */
export type PropertyInterceptor<TDeclaringObject, TObject> = (
    propertyValue: TypePrimitive<TObject>,
    declaringObject: TDeclaringObject,
    propertyMetadata: PropertyMetadata<TDeclaringObject, TObject>
) => TObject;

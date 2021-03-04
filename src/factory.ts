import { Factory } from './core/factory';
import { TypeAndProperty } from './type-and-property';

/**
 * Factory decorator.
 * 
 * Used to define custom factory for type and property.
 * 
 * @param {Factory<TType>} factory Factory.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class and property decorator.
 */
export function Factory(factory: Factory): ClassDecorator & PropertyDecorator
{
    return TypeAndProperty({ factory: factory });
}

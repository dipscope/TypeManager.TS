import { Fn } from './core/fn';
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
export function Factory<TType>(factory: Factory<TType>): ClassDecorator & PropertyDecorator
{
    return TypeAndProperty({ factory: factory });
}

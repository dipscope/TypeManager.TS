import { Factory } from './core/factory';
import { Type } from './type';

/**
 * Factory decorator.
 * 
 * Used to define custom factory for a type.
 * 
 * @param {Factory} factory Factory.
 * 
 * @returns {ClassDecorator} Class decorator.
 */
export function Factory(factory: Factory): ClassDecorator
{
    return Type({ factory: factory });
}

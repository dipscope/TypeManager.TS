import { Discriminant } from './core/discriminant';
import { Type } from './type';

/**
 * Discriminant decorator.
 * 
 * Used to define a discriminant for a type.
 * 
 * @param {Discriminant} discriminant Discriminant.
 * 
 * @returns {ClassDecorator} Class decorator.
 */
export function Discriminant(discriminant: Discriminant): ClassDecorator
{
    return Type({ discriminant: discriminant });
}

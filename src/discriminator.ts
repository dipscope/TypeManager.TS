import { Discriminator } from './core/discriminator';
import { Type } from './type';

/**
 * Discriminator decorator.
 * 
 * Used to define a discriminator for a type.
 * 
 * @param {Discriminator} discriminator Discriminator.
 * 
 * @returns {ClassDecorator} Class decorator.
 */
export function Discriminator(discriminator: Discriminator): ClassDecorator
{
    return Type({ discriminator: discriminator });
}

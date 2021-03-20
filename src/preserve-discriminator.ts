import { Type } from './type';

/**
 * Preserve discriminator decorator.
 * 
 * Used to define that descriminator should be preserved.
 * 
 * @param {boolean} preserveDiscriminator True when descriminator should be preserved. False otherwise.
 * 
 * @returns {ClassDecorator} Class decorator.
 */
export function PreserveDiscriminator(preserveDiscriminator: boolean = true): ClassDecorator
{
    return Type({ preserveDiscriminator: preserveDiscriminator });
}

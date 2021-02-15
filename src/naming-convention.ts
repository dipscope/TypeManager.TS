import { NamingConvention } from './core/naming-convention';
import { TypeAndProperty } from './type-and-property';

/**
 * Naming convention decorator.
 * 
 * Used to define custom naming convention for type and property.
 * 
 * @param {NamingConvention} namingConvention Naming convention.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class and property decorator.
 */
export function NamingConvention(namingConvention: NamingConvention): ClassDecorator & PropertyDecorator
{
    return TypeAndProperty({ namingConvention: namingConvention });
}

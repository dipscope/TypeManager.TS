import { ReferenceHandler } from './core/reference-handler';
import { TypeAndProperty } from './type-and-property';

/**
 * Reference handler decorator.
 * 
 * Used to define custom reference handler for type and property.
 * 
 * @param {ReferenceHandler} referenceHandler Reference handler.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class and property decorator.
 */
export function ReferenceHandler(referenceHandler: ReferenceHandler): ClassDecorator & PropertyDecorator
{
    return TypeAndProperty({ referenceHandler: referenceHandler });
}

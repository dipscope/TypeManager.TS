import { Property } from './../property';

/**
 * Multiple property decorator.
 * 
 * Used to define if certain property is an array.
 *
 * @param {boolean} multiple Multiple?
 * 
 * @returns {PropertyDecorator} Property decorator.
 */
export function Multiple(multiple?: boolean): PropertyDecorator
{
    return Property({ multiple: multiple ?? true });
}

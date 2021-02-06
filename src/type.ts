import { TypeArtisan } from './type.artisan';
import { TypeOptions } from './type.options';

/**
 * Type decorator.
 * 
 * @param {TypeOptions} typeOptions Type options.
 *
 * @returns {ClassDecorator} Class decorator.
 */
export function Type(typeOptions?: TypeOptions): ClassDecorator
{
    return function (target: any): any
    {
        TypeArtisan.defineTypeMetadata(target, typeOptions ?? {});

        return target;
    };
}

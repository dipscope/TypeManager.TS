import { TypeArtisan } from './type.artisan';
import { TypeOptions } from './type.options';
import { TypeDeclaration } from './type.declaration';

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
        TypeArtisan.defineTypeMetadata(target, typeOptions ?? {}, TypeDeclaration.Explicit);

        return target;
    };
}

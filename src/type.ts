import { TypeOptions } from './core/type-options';
import { TypeArtisan } from './type-artisan';

/**
 * Type decorator.
 * 
 * @param {TypeOptions<TType>} typeOptions Type options.
 *
 * @returns {ClassDecorator} Class decorator.
 */
export function Type<TType>(typeOptions?: TypeOptions<TType>): ClassDecorator
{
    return function (target: any): any
    {
        TypeArtisan.defineTypeMetadata(target, typeOptions ?? {}).defineInjectMetadata();

        return target;
    };
}

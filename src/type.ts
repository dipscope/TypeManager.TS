import { TypeOptions } from './core/type-options';
import { TypeManager } from './type-manager';

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
        TypeManager.defineTypeMetadata(target, typeOptions).reflectInjectMetadata();

        return target;
    };
}

import { TypeFn } from './type-fn';
import { TypeManager } from './type-manager';
import { TypeOptions } from './type-options';

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
        const typeFn = target as TypeFn<TType>;
        
        TypeManager.configureTypeMetadata(typeFn, typeOptions).reflectInjectMetadata();

        return target;
    };
}

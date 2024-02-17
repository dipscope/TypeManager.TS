import { TypeDecorator } from './type-decorator';
import { TypeFn } from './type-fn';
import { TypeManager } from './type-manager';
import { TypeOptions } from './type-options';

/**
 * Type decorator.
 * 
 * @param {TypeOptions<TType>} typeOptions Type options.
 *
 * @returns {TypeDecorator} Type decorator.
 */
export function Type<TType>(typeOptions?: TypeOptions<TType>): TypeDecorator
{
    TypeManager.typeScope.open();

    return function (target: any): any
    {
        const typeFn = target as TypeFn<TType>;
        const typeMetadata = TypeManager.configureTypeMetadata(typeFn, typeOptions).reflectInjectMetadata();
        
        TypeManager.typeScope.close(typeMetadata);

        return target;
    };
}

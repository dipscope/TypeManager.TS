import { nameOf } from './functions/name-of';
import { InjectDecorator } from './inject-decorator';
import { InjectOptions } from './inject-options';
import { TypeArgument } from './type-argument';
import { TypeFn } from './type-fn';
import { TypeManager } from './type-manager';

/**
 * Inject decorator.
 * 
 * @param {InjectOptions<TObject>|TypeArgument<TObject>|string} x Inject options, type argument or key from the type context.
 * 
 * @returns {InjectDecorator} Inject decorator.
 */
export function Inject<TObject>(x?: InjectOptions<TObject> | TypeArgument<TObject> | string): InjectDecorator
{
    const injectOptions = (typeof x === 'object' ? x : {}) as InjectOptions<TObject>;

    if (injectOptions.key === undefined && typeof x === 'string')
    {
        injectOptions.key = x as string;
    }

    if (injectOptions.typeArgument === undefined && typeof x === 'function')
    {
        injectOptions.typeArgument = x as TypeArgument<TObject>;
    }
    
    return function (target: any, propertyName: string | symbol | undefined, injectIndex: number): void
    {
        if (typeof target === 'function' && target.name === '')
        {
            throw new Error(`${nameOf(target.constructor)}.${String(propertyName)}: inject decorator cannot be applied to a method.`);
        }
        
        if (typeof injectIndex !== 'number')
        {
            throw new Error(`${nameOf(target)}.${String(propertyName)}: inject decorator cannot be applied to a property.`);
        }
        
        const typeFn = target as TypeFn<any>;
        
        TypeManager.configureTypeMetadata(typeFn).configureInjectMetadata(injectIndex, injectOptions);

        return;
    };
}

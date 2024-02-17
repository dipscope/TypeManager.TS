import { isFunction, isNumber, isObject, isString, isUndefined } from 'lodash';
import { isCtorFunction } from './functions/is-ctor-function';
import { nameOf } from './functions/name-of';
import { InjectDecorator } from './inject-decorator';
import { InjectOptions } from './inject-options';
import { TypeFn } from './type-fn';
import { TypeManager } from './type-manager';

/**
 * Inject decorator.
 * 
 * @param {TypeFn<TType>|InjectOptions<TType>|string} x Type function, inject options or parameter key from type context.
 * 
 * @returns {InjectDecorator} Inject decorator.
 */
export function Inject<TType>(x: TypeFn<TType> | InjectOptions<TType> | string): InjectDecorator
{
    const injectOptions = (isObject(x) ? x : {}) as InjectOptions<TType>;

    if (isUndefined(injectOptions.key) && isString(x))
    {
        injectOptions.key = x;
    }

    if (isUndefined(injectOptions.typeFn) && isFunction(x))
    {
        injectOptions.typeFn = x as TypeFn<TType>;
    }
    
    return function (target: any, propertyName: string | symbol | undefined, injectIndex: number): void
    {
        if (!isCtorFunction(target))
        {
            throw new Error(`${nameOf(target.constructor)}.${String(propertyName)}: inject decorator cannot be applied to a method.`);
        }

        if (!isNumber(injectIndex))
        {
            throw new Error(`${nameOf(target)}.${String(propertyName)}: inject decorator cannot be applied to a property.`);
        }
        
        const typeFn = target as TypeFn<any>;
        
        TypeManager.configureTypeMetadata(typeFn).configureInjectMetadata(injectIndex, injectOptions);

        return;
    };
}

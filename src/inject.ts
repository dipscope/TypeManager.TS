import { Fn } from './core/fn';
import { InjectOptions } from './core/inject-options';
import { TypeFn } from './core/type-fn';
import { TypeManager } from './type-manager';

/**
 * Inject decorator.
 * 
 * @param {TypeFn<TType>|InjectOptions<TType>|string} x Type function, inject options or parameter key from type context.
 * 
 * @returns {ParameterDecorator} Parameter decorator.
 */
export function Inject<TType>(x: TypeFn<TType> | InjectOptions<TType> | string): ParameterDecorator
{
    const injectOptions = (Fn.isObject(x) ? x : {}) as InjectOptions<TType>;

    if (Fn.isUndefined(injectOptions.key) && Fn.isString(x))
    {
        injectOptions.key = x;
    }

    if (Fn.isUndefined(injectOptions.typeFn) && Fn.isFunction(x))
    {
        injectOptions.typeFn = x as TypeFn<TType>;
    }

    return function (target: any, propertyName: string | symbol, injectIndex: number): void
    {
        if (!Fn.isCtor(target))
        {
            throw new Error(`${Fn.nameOf(target.constructor)}.${String(propertyName)}: inject decorator cannot be applied to a method!`);
        }

        if (!Fn.isNumber(injectIndex))
        {
            throw new Error(`${Fn.nameOf(target)}.${String(propertyName)}: inject decorator cannot be applied to a property!`);
        }

        TypeManager.defineTypeMetadata(target).configureInjectMetadata(injectIndex, injectOptions);

        return;
    };
}

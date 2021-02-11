import { Fn, Log } from './utils';
import { TypeCtor } from './type.ctor';
import { InjectArtisan } from './inject.artisan';
import { InjectOptions } from './inject.options';

/**
 * Inject decorator.
 * 
 * @param {TypeCtor<TType>|InjectOptions<TType>|string} x Type constructor, inject options or parameter key from type context.
 * 
 * @returns {ParameterDecorator} Parameter decorator.
 */
export function Inject<TType>(x: TypeCtor<TType> | InjectOptions<TType> | string): ParameterDecorator
{
    const injectOptions = (Fn.isObject(x) ? x : {}) as InjectOptions<TType>;

    if (Fn.isUndefined(injectOptions.key) && Fn.isString(x))
    {
        injectOptions.key = x;
    }

    if (Fn.isUndefined(injectOptions.typeCtor) && Fn.isFunction(x))
    {
        injectOptions.typeCtor = x as TypeCtor<TType>;
    }

    return function (target: any, propertyName: string | symbol, injectIndex: number): void
    {
        if (!Fn.isCtor(target))
        {
            if (Log.errorEnabled) 
            {
                Log.error(`${Fn.nameOf(target.constructor)}.${String(propertyName)}: inject decorator cannot be applied to a method!`);
            }
            
            return;
        }

        if (!Fn.isNumber(injectIndex))
        {
            if (Log.errorEnabled)
            {
                Log.error(`${Fn.nameOf(target)}.${String(propertyName)}: inject decorator cannot be applied to a property!`);
            }
            
            return;
        }

        InjectArtisan.defineInjectMetadata(target, injectIndex, injectOptions);

        return;
    };
}
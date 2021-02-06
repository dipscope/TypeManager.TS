import { Fn, Log } from './utils';
import { TypeCtor } from './type.ctor';
import { InjectArtisan } from './inject.artisan';
import { InjectOptions } from './inject.options';

/**
 * Inject decorator.
 * 
 * @param {TypeCtor|InjectOptions|string} x Type constructor, inject options or parameter key from type context.
 * 
 * @returns {ParameterDecorator} Parameter decorator.
 */
export function Inject(x: TypeCtor | InjectOptions | string): ParameterDecorator
{
    const injectOptions = (Fn.isObject(x) ? x : {}) as InjectOptions;

    if (Fn.isUndefined(injectOptions.key) && Fn.isString(x))
    {
        injectOptions.key = x;
    }

    if (Fn.isUndefined(injectOptions.typeCtor) && Fn.isFunction(x))
    {
        injectOptions.typeCtor = x as TypeCtor;
    }

    return function (target: any, propertyName: string | symbol, injectIndex: number): void
    {
        if (!Fn.isCtor(target))
        {
            if (Log.errorEnabled) 
            {
                Log.error(`${Fn.nameOf(target.constructor)}: inject decorator cannot be applied to a method!`);
            }
            
            return;
        }

        if (!Fn.isNumber(injectIndex))
        {
            if (Log.errorEnabled)
            {
                Log.error(`${Fn.nameOf(target)}: inject decorator cannot be applied to a property!`);
            }
            
            return;
        }

        InjectArtisan.defineInjectMetadata(target, injectIndex, injectOptions);

        return;
    };
}

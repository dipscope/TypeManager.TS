import { TypeCtor } from './type.ctor';
import { Fn } from './fn';
import { TypeDecorator } from './type.decorator';
import { TypeOptions } from './type.options';

/**
 * Type decorator.
 * 
 * @param {TypeOptions} typeOptions Type options.
 *
 * @returns {Function} Decorator function.
 */
export function Type(x?: TypeOptions): Function | void
{
    const usedDirectly = Fn.isFunction(x);
    const typeCtor     = (usedDirectly ? x : null) as TypeCtor;
    const typeOptions  = (usedDirectly ? {} : x ?? {}) as TypeOptions;
    const decorateFn   = TypeDecorator.buildDecorateFn(typeOptions);

    if (usedDirectly) 
    {
        decorateFn(typeCtor);

        return;
    }

    return decorateFn;
}

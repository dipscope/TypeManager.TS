import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';

import { isCtorFunction, nameOf } from './functions';
import { InjectOptions } from './inject-options';
import { TypeFn } from './type-fn';
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
    const injectOptions = (isObject(x) ? x : {}) as InjectOptions<TType>;

    if (isUndefined(injectOptions.key) && isString(x))
    {
        injectOptions.key = x;
    }

    if (isUndefined(injectOptions.typeFn) && isFunction(x))
    {
        injectOptions.typeFn = x as TypeFn<TType>;
    }

    return function (target: any, propertyName: string | symbol, injectIndex: number): void
    {
        if (!isCtorFunction(target))
        {
            throw new Error(`${nameOf(target.constructor)}.${String(propertyName)}: inject decorator cannot be applied to a method.`);
        }

        if (!isNumber(injectIndex))
        {
            throw new Error(`${nameOf(target)}.${String(propertyName)}: inject decorator cannot be applied to a property.`);
        }

        TypeManager.defineTypeMetadata(target).configureInjectMetadata(injectIndex, injectOptions);

        return;
    };
}

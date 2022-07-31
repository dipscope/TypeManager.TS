import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isSymbol from 'lodash/isSymbol';
import merge from 'lodash/merge';
import { isCtorFunction } from './functions/is-ctor-function';
import { nameOf } from './functions/name-of';
import { GenericArgument } from './generic-argument';
import { PropertyOptions } from './property-options';
import { TypeArgument } from './type-argument';
import { TypeManager } from './type-manager';

/**
 * Property decorator.
 * 
 * @param {TypeArgument<TType>|Array<GenericArgument<any>>|PropertyOptions<TType>} x Type argument, generic arguments or property options.
 * @param {Array<GenericArgument<any>>|PropertyOptions<TType>} y Generic arguments or property options if first parameter is type argument.
 * @param {PropertyOptions<TType>} z Property options if second parameter are generic arguments.
 * 
 * @returns {PropertyDecorator} Property decorator.
 */
export function Property<TType>(
    x?: TypeArgument<TType> | Array<GenericArgument<any>> | PropertyOptions<TType>, 
    y?: Array<GenericArgument<any>> | PropertyOptions<TType>,
    z?: PropertyOptions<TType>
): PropertyDecorator
{
    const propertyOptions = {} as PropertyOptions<TType>;

    if (isObject(z))
    {
        merge(propertyOptions, z);
    }

    if (isObject(y) && !isArray(y))
    {
        merge(propertyOptions, y);
    }

    if (isObject(x) && !isArray(x))
    {
        merge(propertyOptions, x);
    }

    if (isArray(y))
    {
        propertyOptions.genericArguments = y;
    }

    if (isArray(x))
    {
        propertyOptions.genericArguments = x;
    }

    if (isString(x) || isFunction(x) || isCtorFunction(x))
    {
        propertyOptions.typeArgument = x;
    }

    return function (target: any, propertyName: string | symbol): void
    {
        if (isCtorFunction(target))
        {
            throw new Error(`${nameOf(target)}.${String(propertyName)}: property decorator cannot be applied to a static member.`);
        }

        if (isSymbol(propertyName))
        {
            throw new Error(`${nameOf(target.constructor)}.${String(propertyName)}: property decorator cannot be applied to a symbol.`);
        }

        if (isFunction(target[propertyName]))
        {
            throw new Error(`${nameOf(target.constructor)}.${String(propertyName)}: property decorator cannot be applied to a method.`);
        }

        TypeManager.defineTypeMetadata(target.constructor).configurePropertyMetadata(propertyName, propertyOptions);

        return;
    };
}

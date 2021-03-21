import { GenericArgument, TypeArgument } from './core';
import { Fn } from './core/fn';
import { PropertyOptions } from './core/property-options';
import { TypeManager } from './type-manager';

/**
 * Property decorator.
 * 
 * @param {TypeArgument<TType>|GenericArgument<any>[]|PropertyOptions<TType>} x Type argument, generic arguments or property options.
 * @param {GenericArgument<any>[]|PropertyOptions<TType>} y Generic arguments or property options if first parameter is type argument.
 * @param {PropertyOptions<TType>} z Property options if second parameter are generic arguments.
 * 
 * @returns {PropertyDecorator} Property decorator.
 */
export function Property<TType>(
    x?: TypeArgument<TType> | GenericArgument<any>[] | PropertyOptions<TType>, 
    y?: GenericArgument<any>[] | PropertyOptions<TType>,
    z?: PropertyOptions<TType>
): PropertyDecorator
{
    const propertyOptions = {} as PropertyOptions<TType>;

    if (Fn.isObject(z))
    {
        Fn.assign(propertyOptions, z);
    }

    if (Fn.isObject(y) && !Fn.isArray(y))
    {
        Fn.assign(propertyOptions, y);
    }

    if (Fn.isObject(x) && !Fn.isArray(x))
    {
        Fn.assign(propertyOptions, x);
    }

    if (Fn.isArray(y))
    {
        propertyOptions.genericArguments = y;
    }

    if (Fn.isArray(x))
    {
        propertyOptions.genericArguments = x;
    }

    if (Fn.isString(x) || Fn.isFunction(x) || Fn.isCtor(x))
    {
        propertyOptions.typeArgument = x;
    }

    return function (target: any, propertyName: string | symbol): void
    {
        if (Fn.isCtor(target))
        {
            throw new Error(`${Fn.nameOf(target)}.${String(propertyName)}: property decorator cannot be applied to a static property!`);
        }

        if (Fn.isSymbol(propertyName))
        {
            throw new Error(`${Fn.nameOf(target.constructor)}.${String(propertyName)}: property decorator cannot be applied to a symbol!`);
        }

        if (Fn.isFunction(target[propertyName])) 
        {
            throw new Error(`${Fn.nameOf(target.constructor)}.${String(propertyName)}: property decorator cannot be applied to a method property!`);
        }

        TypeManager.defineTypeMetadata(target.constructor).configurePropertyMetadata(propertyName, propertyOptions);

        return;
    };
}

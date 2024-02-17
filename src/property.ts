import { isArray, isFunction, isObject, isString, isSymbol, isUndefined, merge } from 'lodash';
import { isCtorFunction } from './functions/is-ctor-function';
import { nameOf } from './functions/name-of';
import { GenericArgument } from './generic-argument';
import { PropertyDecorator } from './property-decorator';
import { PropertyOptions } from './property-options';
import { TypeArgument } from './type-argument';
import { TypeFn } from './type-fn';
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

    return function (target: any, context: any): any
    {
        // Modern decorator has a dynamic target which is dependent from where decorator 
        // is applied (target), context as a second parameter (context) and optional 
        // resolver like return type.
        if (isObject(context) && context.hasOwnProperty('kind'))
        {
            const decoratorContext = context as any;
            const kind = decoratorContext.kind;
            const propertyName = decoratorContext.name;

            if (kind === 'method' || kind === 'class')
            {
                throw new Error(`${String(propertyName)}: property decorator cannot be applied to a method or a class.`);
            }

            if (isUndefined(propertyName))
            {
                throw new Error(`${String(propertyName)}: property decorator cannot be applied to undefined values.`);
            }

            if (isSymbol(propertyName))
            {
                throw new Error(`${String(propertyName)}: property decorator cannot be applied to a symbol.`);
            }

            TypeManager.typeScope.addPropertyOptions(propertyName, propertyOptions);

            return;
        }

        // Legacy decorator has class reference as a first parameter (target), property name 
        // or symbol as a second parameter (context) and no return type.
        if (isObject(target) && (isString(context) || isSymbol(context)))
        {
            const legacyTarget = target as any;
            const propertyName = context as string | symbol | undefined;

            if (isCtorFunction(legacyTarget))
            {
                throw new Error(`${nameOf(legacyTarget)}.${String(propertyName)}: property decorator cannot be applied to a static member.`);
            }

            if (isUndefined(propertyName))
            {
                throw new Error(`${nameOf(legacyTarget)}.${String(propertyName)}: property decorator cannot be applied to undefined values.`);
            }

            if (isSymbol(propertyName))
            {
                throw new Error(`${nameOf(legacyTarget.constructor)}.${String(propertyName)}: property decorator cannot be applied to a symbol.`);
            }
    
            if (isFunction(legacyTarget[propertyName]))
            {
                throw new Error(`${nameOf(legacyTarget.constructor)}.${String(propertyName)}: property decorator cannot be applied to a method.`);
            }
    
            const typeFn = legacyTarget.constructor as TypeFn<any>;
            
            TypeManager.configureTypeMetadata(typeFn).configurePropertyMetadata(propertyName, propertyOptions);
    
            return;
        }

        throw new Error(`Property decorator was not able to detect correct resolver for the following target [${target}] and context [${context}].`);
    };
}

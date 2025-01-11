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
 * @param {TypeArgument<TObject>|Array<GenericArgument<any>>|PropertyOptions<TObject>} x Type argument, generic arguments or property options.
 * @param {Array<GenericArgument<any>>|PropertyOptions<TObject>} y Generic arguments or property options if first parameter is type argument.
 * @param {PropertyOptions<TObject>} z Property options if second parameter are generic arguments.
 * 
 * @returns {PropertyDecorator} Property decorator.
 */
export function Property<TObject>(
    x?: TypeArgument<TObject> | Array<GenericArgument<any>> | PropertyOptions<TObject>, 
    y?: Array<GenericArgument<any>> | PropertyOptions<TObject>,
    z?: PropertyOptions<TObject>
): PropertyDecorator
{
    const propertyOptions = {} as PropertyOptions<TObject>;

    if (typeof z === 'object')
    {
        Object.assign(propertyOptions, z);
    }

    if (typeof y === 'object' && !Array.isArray(y))
    {
        Object.assign(propertyOptions, y);
    }

    if (typeof x === 'object' && !Array.isArray(x))
    {
        Object.assign(propertyOptions, x);
    }

    if (Array.isArray(y))
    {
        propertyOptions.genericArguments = y as Array<GenericArgument<any>>;
    }

    if (Array.isArray(x))
    {
        propertyOptions.genericArguments = x as Array<GenericArgument<any>>;
    }

    if (typeof x === 'string' || typeof x === 'function')
    {
        propertyOptions.typeArgument = x as TypeArgument<TObject>;
    }

    return function (target: any, context: any): any
    {
        // Modern decorator has a dynamic target which is dependent from where decorator 
        // is applied (target), context as a second parameter (context) and optional 
        // resolver like return type.
        if (context !== null && typeof context === 'object' && context.hasOwnProperty('kind'))
        {
            const decoratorContext = context as any;
            const kind = decoratorContext.kind;
            const propertyName = decoratorContext.name;

            if (kind === 'method' || kind === 'class')
            {
                throw new Error(`${String(propertyName)}: property decorator cannot be applied to a method or a class.`);
            }

            if (propertyName === undefined)
            {
                throw new Error(`${String(propertyName)}: property decorator cannot be applied to undefined values.`);
            }

            if (typeof propertyName === 'symbol')
            {
                throw new Error(`${String(propertyName)}: property decorator cannot be applied to a symbol.`);
            }

            TypeManager.typeScope.addPropertyOptions(propertyName, propertyOptions);

            return;
        }

        // Legacy decorator has class reference as a first parameter (target), property name 
        // or symbol as a second parameter (context) and no return type.
        if (target !== null && typeof target === 'object' && (typeof context === 'string' || typeof context === 'symbol'))
        {
            const legacyTarget = target as any;
            const propertyName = context as string | symbol | undefined;
            
            if (typeof legacyTarget === 'function' && legacyTarget.name !== '')
            {
                throw new Error(`${nameOf(legacyTarget)}.${String(propertyName)}: property decorator cannot be applied to a static member.`);
            }

            if (propertyName === undefined)
            {
                throw new Error(`${nameOf(legacyTarget)}.${String(propertyName)}: property decorator cannot be applied to undefined values.`);
            }

            if (typeof propertyName === 'symbol')
            {
                throw new Error(`${nameOf(legacyTarget.constructor)}.${String(propertyName)}: property decorator cannot be applied to a symbol.`);
            }
    
            if (typeof legacyTarget[propertyName] === 'function')
            {
                throw new Error(`${nameOf(legacyTarget.constructor)}.${String(propertyName)}: property decorator cannot be applied to a method.`);
            }
    
            const typeFn = legacyTarget.constructor as TypeFn<any>;
            
            TypeManager.configureTypeMetadata(typeFn).configurePropertyMetadata(propertyName as string, propertyOptions);
    
            return;
        }

        throw new Error(`Property decorator was not able to detect correct resolver for the following target [${target}] and context [${context}].`);
    };
}

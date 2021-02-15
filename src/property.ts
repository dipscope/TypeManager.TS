import { Fn } from './core/fn';
import { TypeResolver } from './core/type-resolver';
import { PropertyOptions } from './core/property-options';
import { PropertyArtisan } from './property-artisan';

/**
 * Property decorator.
 * 
 * @param {TypeResolver<TType>|PropertyOptions<TType>|string} x Type resolver, type options or type alias.
 * @param {PropertyOptions<TType>} y Property options if first argument is a type resolver.
 * 
 * @returns {PropertyDecorator} Property decorator.
 */
export function Property<TType>(x?: TypeResolver<TType> | PropertyOptions<TType> | string, y?: PropertyOptions<TType>): PropertyDecorator
{
    const typeResolver    = Fn.isFunction(x) ? x : (Fn.isString(x) ? PropertyArtisan.buildTypeResolverForAlias(x) : undefined) as TypeResolver<TType>;
    const propertyOptions = Fn.isObject(y) ? y : (Fn.isObject(x) ? x : {}) as PropertyOptions<TType>;
    
    if (Fn.isUndefined(propertyOptions.typeResolver))
    {
        propertyOptions.typeResolver = Fn.isString(propertyOptions.typeAlias) ? PropertyArtisan.buildTypeResolverForAlias(propertyOptions.typeAlias) : typeResolver;
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

        PropertyArtisan.definePropertyMetadata(target.constructor, propertyName, propertyOptions);

        return;
    };
}

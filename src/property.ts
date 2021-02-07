import { Fn, Log } from './utils';
import { TypeResolver } from './type.resolver';
import { PropertyArtisan } from './property.artisan';
import { PropertyOptions } from './property.options';

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
            if (Log.errorEnabled) 
            {
                Log.error(`${Fn.nameOf(target)}.${String(propertyName)}: property decorator cannot be applied to a static property!`);
            }
            
            return;
        }

        if (Fn.isSymbol(propertyName))
        {
            if (Log.errorEnabled) 
            {
                Log.error(`${Fn.nameOf(target.constructor)}.${String(propertyName)}: property decorator cannot be applied to a symbol!`);
            }

            return;
        }

        if (Fn.isFunction(target[propertyName])) 
        {
            if (Log.errorEnabled)
            {
                Log.error(`${Fn.nameOf(target.constructor)}.${String(propertyName)}: property decorator cannot be applied to a method property!`);
            }
            
            return;
        }

        PropertyArtisan.definePropertyMetadata(target.constructor, propertyName, propertyOptions);

        return;
    };
}

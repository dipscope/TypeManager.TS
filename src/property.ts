import { Fn, Log } from './utils';
import { TypeResolver } from './type.resolver';
import { PropertyArtisan } from './property.artisan';
import { PropertyOptions } from './property.options';

/**
 * Property decorator.
 * 
 * @param {TypeResolver|PropertyOptions|string} x Type resolver, type options or type alias.
 * @param {PropertyOptions} y Property options if first argument is a type resolver.
 * 
 * @returns {PropertyDecorator} Property decorator.
 */
export function Property(x?: TypeResolver | PropertyOptions | string, y?: PropertyOptions): PropertyDecorator
{
    const typeResolver    = Fn.isFunction(x) ? x : (Fn.isString(x) ? PropertyArtisan.buildTypeResolverForAlias(x) : undefined) as TypeResolver;
    const propertyOptions = Fn.isObject(y) ? y : (Fn.isObject(x) ? x : {}) as PropertyOptions;
    
    if (Fn.isUndefined(propertyOptions.typeResolver))
    {
        propertyOptions.typeResolver = Fn.isString(propertyOptions.typeAlias) ? PropertyArtisan.buildTypeResolverForAlias(propertyOptions.typeAlias) : typeResolver;
    }

    return function (target: any, propertyName: string | symbol): void
    {
        const declaringTypeCtor = target.constructor;
        const targetName        = `${Fn.nameOf(declaringTypeCtor)}.${String(propertyName)}`;

        if (Fn.isFunction(target))
        {
            if (Log.errorEnabled) 
            {
                Log.error(`${targetName}: cannot decorate a static property!`);
            }
            
            return;
        }

        if (Fn.isSymbol(propertyName))
        {
            if (Log.errorEnabled) 
            {
                Log.error(`${targetName}: cannot decorate a symbol property!`);
            }

            return;
        }

        if (Fn.isFunction(target[propertyName])) 
        {
            if (Log.errorEnabled)
            {
                Log.error(`${targetName}: cannot decorate a method property!`);
            }
            
            return;
        }
        
        PropertyArtisan.injectPropertyMetadata(declaringTypeCtor, propertyName, propertyOptions);

        return;
    };
}

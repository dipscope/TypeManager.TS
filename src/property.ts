import { Fn } from './fn';
import { PropertyDecorator } from './property.decorator';
import { PropertyOptions } from './property.options';
import { TypeResolver } from './type.resolver';

export function Property(x?: TypeResolver | PropertyOptions, y?: PropertyOptions): Function | void
{
    const usedDirectly    = !Fn.isNil(y) && Fn.isString(y);
    const target          = usedDirectly ? x : null;
    const propertyName    = usedDirectly ? y : null;
    const propertyOptions = (usedDirectly ? {} : (Fn.isObject(y) ? y : (Fn.isObject(x) ? x : {}))) as PropertyOptions;
    const typeResolver    = (usedDirectly ? null : (Fn.isFunction(x) ? x : (Fn.isString(x) ? PropertyDecorator.buildTypeResolverForAlias(x) : null))) as TypeResolver;

    if (Fn.isNil(propertyOptions.typeResolver)) 
    {
        propertyOptions.typeResolver = typeResolver;
    }
    
    if (Fn.isNil(propertyOptions.reflectMetadata)) 
    {
        propertyOptions.reflectMetadata = true;
    }

    const decorateFn = PropertyDecorator.buildDecorateFn(propertyOptions);

    if (usedDirectly) 
    {
        decorateFn(target, propertyName);

        return;
    }

    return decorateFn;
}

/**
 * Serializable property decorator.
 * 
 * Used to define if certain property should be serializable. By default if this 
 * decorator is not applied property is serializable and deserializable.
 *
 * @returns {Function} Decorator function.
 */
export function Serializable(): Function
{
    return Property({ serializable: true, reflectMetadata: false }) as Function;
}

/**
 * Deserializable property decorator.
 * 
 * Used to define if certain property should be deserializable. By default if this 
 * decorator is not applied property is serializable and deserializable.
 *
 * @returns {Function} Decorator function.
 */
export function Deserializable(): Function
{
    return Property({ deserializable: true, reflectMetadata: false }) as Function;
}

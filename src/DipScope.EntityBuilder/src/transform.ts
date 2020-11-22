import { EntityBuilder } from './entity.builder';
import { TransformDescriptor } from './transform.descriptor';

/**
 * Property transform decorator.
 *
 * Used to apply additional property transformation. 
 * For example transform date string to date time object and etc.
 * 
 * @param {Function} deserializeFn Deserialize function.
 * @param {Function} serializeFn Serialize function.
 *
 * @returns {Function} Decorator function.
 */
export function Transform(deserializeFn: (x: any) => any = (x) => x, serializeFn: (x: any) => any = (x) => x): Function
{
    return function (target: any, propertyName: string): void
    {
        const transformDescriptor = new TransformDescriptor(target.constructor, propertyName, serializeFn, deserializeFn);

        EntityBuilder.registerTransformDescriptor(transformDescriptor);

        return;
    }
}

/**
 * Alias for transform decorator.
 * 
 * @param {Function} deserializeFn Deserialize function.
 * @param {Function} serializeFn Serialize function.
 * 
 * @returns {Function}  Decorator function.
 */
export function Convert(deserializeFn: (x: any) => any = (x) => x, serializeFn: (x: any) => any = (x) => x): Function
{
    return Transform(deserializeFn, serializeFn);
}

import { PropertyOptions } from './property.options';
import { InjectOptions } from './inject.options';
import { TypeOptionsBase } from './type.options.base';

/**
 * Type options interface.
 * 
 * @type {TypeOptions<TType>}
 */
export interface TypeOptions<TType> extends Partial<TypeOptionsBase<TType>>
{
    /**
     * Type alias. 
     * 
     * Can be used to resolve a type at runtime instead of type resolver function.
     * 
     * @type {string}
     */
    alias?: string;

    /**
     * Injectable type?
     * 
     * @type {boolean}
     */
    injectable?: boolean;

    /**
     * Inject options related to this type. Map key is an injection index.
     * 
     * @type {Map<number, InjectOptions<any>>}
     */
    injectOptionsMap?: Map<number, InjectOptions<any>>;

    /**
     * Property options related to this type. Map key is a property name.
     * 
     * @type {Map<string, PropertyOptions<any>>}
     */
    propertyOptionsMap?: Map<string, PropertyOptions<any>>;
}

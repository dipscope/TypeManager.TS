import { Serializer } from './serializer';
import { Factory } from './factory';
import { Injector } from './injector';
import { CustomData } from './custom-data';
import { Log } from './log';
import { NamingConvention } from './naming-convention';

/**
 * Type options base interface.
 * 
 * @type {TypeOptionsBase<TType>}
 */
export interface TypeOptionsBase<TType>
{
    /**
     * Custom developer data.
     * 
     * @type {CustomData}
     */
    customData: CustomData;

    /**
     * Default value for undefined ones.
     * 
     * Assigned only when use default value option is true.
     * 
     * @type {any}
     */
    defaultValue?: any;

    /**
     * Factory used to build instances of type.
     * 
     * @type {Factory<TType>}
     */
    factory: Factory<TType>;

    /**
     * Injector used to resolve types.
     * 
     * @type {Injector}
     */
    injector: Injector;

    /**
     * Log instance with specified log level.
     * 
     * @type {Log}
     */
    log: Log;

    /**
     * Naming convention.
     * 
     * @type {NamingConvention}
     */
    namingConvention?: NamingConvention;

    /**
     * Serializer used to serialize and deserialize a type.
     * 
     * @type {Serializer<TType>}
     */
    serializer: Serializer<TType>;

    /**
     * Use default value assignment for undefined values?
     * 
     * @type {boolean}
     */
    useDefaultValue: boolean;

    /**
     * Use implicit conversion when provided value can be converted
     * to the target one?
     * 
     * @type {boolean}
     */
    useImplicitConversion: boolean;
}

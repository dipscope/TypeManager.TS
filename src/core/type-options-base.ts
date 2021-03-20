import { CustomData } from './custom-data';
import { Discriminator } from './discriminator';
import { Factory } from './factory';
import { Injector } from './injector';
import { Log } from './log';
import { NamingConvention } from './naming-convention';
import { ReferenceHandler } from './reference-handler';
import { Serializer } from './serializer';

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
    customData?: CustomData;

    /**
     * Discriminator.
     * 
     * @type {Discriminator}
     */
    discriminator: Discriminator;

    /**
     * Default value for undefined ones.
     * 
     * Can be a lazy function which returns a value. Assigned only when 
     * use default value option is true.
     * 
     * @type {any}
     */
    defaultValue?: any;

    /**
     * Factory used to build instances of type.
     * 
     * @type {Factory}
     */
    factory: Factory;

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
     * Preserve discriminator in object during serialization 
     * and deserialization?
     * 
     * @type {boolean}
     */
    preserveDiscriminator: boolean;

    /**
     * Reference handler.
     * 
     * @type {ReferenceHandler}
     */
    referenceHandler: ReferenceHandler;

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

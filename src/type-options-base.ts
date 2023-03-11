import { CustomData } from './custom-data';
import { Discriminator } from './discriminator';
import { Factory } from './factory';
import { InjectMetadataSorter } from './inject-metadata-sorter';
import { Injector } from './injector';
import { Log } from './log';
import { NamingConvention } from './naming-convention';
import { PropertyMetadataSorter } from './property-metadata-sorter';
import { ReferenceHandler } from './reference-handler';
import { Serializer } from './serializer';

/**
 * Type options base interface.
 * 
 * @type {TypeOptionsBase<TType>}
 */
export type TypeOptionsBase<TType> =
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
     * If set to true then null values are preserved. Otherwise they will be 
     * treated as undefined.
     * 
     * @type {boolean}
     */
    preserveNull: boolean,

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

    /**
     * Property metadata sorter used to sort properties during serialization 
     * and deserialization.
     * 
     * @type {PropertyMetadataSorter}
     */
    propertyMetadataSorter?: PropertyMetadataSorter;
    
    /**
     * Inject metadata sorter used to sort injects during serialization 
     * and deserialization.
     * 
     * @type {InjectMetadataSorter}
     */
    injectMetadataSorter?: InjectMetadataSorter;
}

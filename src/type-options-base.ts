import { CustomOptions } from './custom-options';
import { Discriminator } from './discriminator';
import { Factory } from './factory';
import { InjectSorter } from './inject-sorter';
import { Injector } from './injector';
import { Log } from './log';
import { NamingConvention } from './naming-convention';
import { PropertySorter } from './property-sorter';
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
     * Custom options defined by developer.
     * 
     * @type {CustomOptions}
     */
    customOptions?: CustomOptions;

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
     * Property sorter used to sort properties during serialization 
     * and deserialization.
     * 
     * @type {PropertySorter}
     */
    propertySorter?: PropertySorter;
    
    /**
     * Inject sorter used to sort injects during serialization 
     * and deserialization.
     * 
     * @type {InjectSorter}
     */
    injectSorter?: InjectSorter;
}

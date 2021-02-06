import { TypeSerializer } from './type.serializer';
import { TypeFactory } from './type.factory';
import { TypeInjector } from './type.injector';
import { CustomData } from './custom.data';

/**
 * Type options base interface.
 * 
 * @type {TypeOptionsBase}
 */
export interface TypeOptionsBase
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
     * Type factory used to build instances of type.
     * 
     * @type {TypeFactory}
     */
    typeFactory: TypeFactory;

    /**
     * Type injector used to resolve types.
     * 
     * @type {TypeInjector}
     */
    typeInjector: TypeInjector;

    /**
     * Serializer used to serialize and deserialize a type.
     * 
     * @type {TypeSerializer}
     */
    typeSerializer: TypeSerializer;
}

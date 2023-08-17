import { PropertyExtensionOptions } from './property-extension-options';
import { PropertyMetadata } from './property-metadata';

/**
 * Property extension metadata used by plugins to provide additional features for property metadata 
 * using custom keys. Descendant classes are just wrappers to get convenient access to custom context.
 * 
 * @type {PropertyExtensionMetadata<TDeclaringType, TType, TPropertyExtensionOptions>}
 */
export abstract class PropertyExtensionMetadata<TDeclaringType, TType, TPropertyExtensionOptions extends PropertyExtensionOptions>
{
    /**
     * Property metadata which we extend.
     * 
     * @type {PropertyMetadata<TDeclaringType, TType>}
     */
    public readonly propertyMetadata: PropertyMetadata<TDeclaringType, TType>;

    /**
     * Constructor.
     * 
     * @param {PropertyMetadata<TDeclaringType, TType>} propertyMetadata Property metadata which we extend.
     * @param {TPropertyExtensionOptions} propertyExtensionOptions Property extension options.
     */
    public constructor(propertyMetadata: PropertyMetadata<TDeclaringType, TType>, propertyExtensionOptions: TPropertyExtensionOptions)
    {
        this.propertyMetadata = propertyMetadata;

        this.configure(propertyExtensionOptions);

        return;
    }
    
    /**
     * Configures property extension.
     * 
     * @param {TPropertyExtensionOptions} propertyExtensionOptions Property extension options.
     * 
     * @returns {this} Property extension metadata.
     */
    public abstract configure(propertyExtensionOptions: TPropertyExtensionOptions): this;
}

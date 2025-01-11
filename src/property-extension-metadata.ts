import { PropertyExtensionOptions } from './property-extension-options';
import { PropertyMetadata } from './property-metadata';

/**
 * Property extension metadata used by plugins to provide additional features for property metadata 
 * using custom keys. Descendant classes are just wrappers to get convenient access to custom value map.
 * 
 * @type {PropertyExtensionMetadata<TDeclaringObject, TObject, TPropertyExtensionOptions>}
 */
export abstract class PropertyExtensionMetadata<TDeclaringObject, TObject, TPropertyExtensionOptions extends PropertyExtensionOptions>
{
    /**
     * Property metadata which we extend.
     * 
     * @type {PropertyMetadata<TDeclaringObject, TObject>}
     */
    public readonly propertyMetadata: PropertyMetadata<TDeclaringObject, TObject>;

    /**
     * Constructor.
     * 
     * @param {PropertyMetadata<TDeclaringObject, TObject>} propertyMetadata Property metadata which we extend.
     * @param {TPropertyExtensionOptions} propertyExtensionOptions Property extension options.
     */
    public constructor(propertyMetadata: PropertyMetadata<TDeclaringObject, TObject>, propertyExtensionOptions: TPropertyExtensionOptions)
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

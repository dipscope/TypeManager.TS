import { TypeExtensionOptions } from './type-extension-options';
import { TypeMetadata } from './type-metadata';

/**
 * Type extension metadata used by plugins to provide additional features for type metadata 
 * using custom keys. Descendant classes are just wrappers to get convenient access to custom context.
 * 
 * @type {TypeExtensionMetadata<TObject, TTypeExtensionOptions>}
 */
export abstract class TypeExtensionMetadata<TObject, TTypeExtensionOptions extends TypeExtensionOptions>
{
    /**
     * Type metadata which we extend.
     * 
     * @type {TypeMetadata<TObject>}
     */
    public readonly typeMetadata: TypeMetadata<TObject>;

    /**
     * Constructor.
     * 
     * @param {TypeMetadata<TObject>} typeMetadata Type metadata which we extend.
     * @param {TTypeExtensionOptions} typeExtensionOptions Type extension options.
     */
    public constructor(typeMetadata: TypeMetadata<TObject>, typeExtensionOptions: TTypeExtensionOptions)
    {
        this.typeMetadata = typeMetadata;

        this.configure(typeExtensionOptions);

        return;
    }

    /**
     * Configures type extension.
     * 
     * @param {TTypeExtensionOptions} typeExtensionOptions Type extension options.
     * 
     * @returns {this} Type extension metadata.
     */
    public abstract configure(typeExtensionOptions: TTypeExtensionOptions): this;
}

import { TypeCtor } from './type.ctor';
import { PropertyOptions } from './property.options';
import { TypeArtisan } from './type.artisan';
import { PropertyMetadata } from './property.metadata';
import { TypeResolver } from './type.resolver';

/**
 * Property artisan class to encapsulate property manipulating functions.
 * 
 * @type {PropertyArtisan}
 */
export class PropertyArtisan
{
    /**
     * Injects property metadata to a certain type metadata.
     * 
     * @param {TypeCtor} typeCtor Type constructor function.
     * @param {string} propertyName Property name.
     * @param {PropertyOptions} propertyOptions Property options.
     * 
     * @returns {PropertyMetadata} Property metadata for provided property.
     */
    public static injectPropertyMetadata(typeCtor: TypeCtor, propertyName: string, propertyOptions: PropertyOptions): PropertyMetadata
    {
        const typeMetadata     = TypeArtisan.declareTypeMetadata(typeCtor);
        const metadataInjected = typeMetadata.propertyMetadataMap.has(propertyName);
        const propertyMetadata = metadataInjected ? typeMetadata.propertyMetadataMap.get(propertyName)! : new PropertyMetadata(propertyName);

        if (!metadataInjected)
        {
            typeMetadata.propertyMetadataMap.set(propertyName, propertyMetadata);
        }

        return propertyMetadata.configure(propertyOptions);
    }

    /**
     * Builds type resolver for type alias.
     * 
     * @param {string} typeAlias Type alias.
     * 
     * @returns {TypeResolver} Configured type resolver.
     */
    public static buildTypeResolverForAlias(typeAlias: string): TypeResolver
    {
        const typeResolver = () => TypeArtisan.typeCtorMap.get(typeAlias);

        return typeResolver;
    }
}

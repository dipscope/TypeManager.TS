import { TypeCtor } from './type.ctor';
import { TypeArtisan } from './type.artisan';
import { TypeResolver } from './type.resolver';
import { PropertyOptions } from './property.options';
import { PropertyMetadata } from './property.metadata';

/**
 * Property artisan class to encapsulate property manipulating functions.
 * 
 * @type {PropertyArtisan}
 */
export class PropertyArtisan
{
    /**
     * Defines property metadata for a certain type constructor.
     * 
     * @param {TypeCtor<TDeclaringType>} declaringTypeCtor Declaring type constructor function.
     * @param {string} propertyName Property name.
     * @param {PropertyOptions<TType>} propertyOptions Property options.
     * 
     * @returns {PropertyMetadata<TDeclaringType, TType>} Property metadata for provided type constructor.
     */
    public static definePropertyMetadata<TDeclaringType, TType>(
        declaringTypeCtor: TypeCtor<TDeclaringType>, 
        propertyName: string, 
        propertyOptions: PropertyOptions<TType>
    ): PropertyMetadata<TDeclaringType, TType>
    {
        const typeMetadata     = TypeArtisan.defineTypeMetadata(declaringTypeCtor);
        const propertyMetadata = typeMetadata.configurePropertyMetadata(propertyName, propertyOptions);

        return propertyMetadata;
    }

    /**
     * Builds type resolver for type alias.
     * 
     * @param {string} typeAlias Type alias.
     * 
     * @returns {TypeResolver<any>} Configured type resolver.
     */
    public static buildTypeResolverForAlias(typeAlias: string): TypeResolver<any>
    {
        const typeResolver = () => TypeArtisan.typeCtorMap.get(typeAlias);

        return typeResolver;
    }
}

import { Factory, Property, Type, TypeArtisan } from '../src';
import { TypeFactory } from '../src/factories';

@Type()
@Factory(new TypeFactory())
class User
{
    @Property() @Factory(new TypeFactory()) public name?: string;
}

describe('Type factory decorator', () =>
{
    it('should register custom factory for a type', () =>
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.factory).toBeInstanceOf(TypeFactory);
    });

    it('should register custom factory for a property', () =>
    {
        const userMetadata     = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.factory).toBeInstanceOf(TypeFactory);
    });
});

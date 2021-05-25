import { Property, Serializer, Type, TypeManager } from '../src';
import { StringSerializer, TypeSerializer } from '../src/serializers';

@Type()
@Serializer(new TypeSerializer())
class User
{
    @Property() @Serializer(new StringSerializer()) public name?: string;
}

describe('Type serializer decorator', () =>
{
    it('should register custom serializer for a type', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.serializer).toBeInstanceOf(TypeSerializer);
    });

    it('should register custom serializer for a property', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.serializer).toBeInstanceOf(StringSerializer);
    });
});

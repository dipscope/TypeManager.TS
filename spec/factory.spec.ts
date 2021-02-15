import { Type, TypeArtisan, Property, Factory } from './../src';
import { ObjectFactory } from './../src/factories';

@Type()
@Factory(new ObjectFactory())
class User
{
    @Property() @Factory(new ObjectFactory()) public name?: string;
}

describe('Type factory decorator', function () 
{
    it('should register custom factory for a type', function ()
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.factory).toBeInstanceOf(ObjectFactory);
    });

    it('should register custom factory for a property', function ()
    {
        const userMetadata     = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.factory).toBeInstanceOf(ObjectFactory);
    });
});

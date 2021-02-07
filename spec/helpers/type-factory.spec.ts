import { Type, TypeArtisan, Property } from './../../src';
import { ObjectFactory } from './../../src/factories';
import { TypeFactory } from './../../src/helpers';

@Type()
@TypeFactory(new ObjectFactory())
class User
{
    @Property() @TypeFactory(new ObjectFactory()) public name?: string;
}

describe('Type factory decorator', function () 
{
    it('should register custom factory for a type', function ()
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.typeFactory).toBeInstanceOf(ObjectFactory);
    });

    it('should register custom factory for a property', function ()
    {
        const userMetadata     = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.typeFactory).toBeInstanceOf(ObjectFactory);
    });
});

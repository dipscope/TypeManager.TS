import { Type, TypeArtisan, Property } from './../../src';
import { ObjectFactory } from './../../src/factories';
import { TypeFactory } from './../../src/helpers';

@Type()
@TypeFactory(new ObjectFactory())
class X
{
    @Property() @TypeFactory(new ObjectFactory()) public a?: string;
}

describe('Type factory decorator', function () 
{
    it('should register custom factory for a type', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        expect(typeMetadata.typeOptions.typeFactory).toBeInstanceOf(ObjectFactory);
    });

    it('should register custom factory for a property', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.propertyOptions.typeFactory).toBeInstanceOf(ObjectFactory);
    });
});

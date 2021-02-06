import { Type, TypeArtisan, Property } from './../../src';
import { TypeInjector } from './../../src/helpers';
import { SingletonInjector } from './../../src/injectors';

@Type()
@TypeInjector(new SingletonInjector())
class X
{
    @Property() @TypeInjector(new SingletonInjector()) public a?: string;
}

describe('Type injector decorator', function () 
{
    it('should register custom injector for a type', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        expect(typeMetadata.typeOptions.typeInjector).toBeInstanceOf(SingletonInjector);
    });

    it('should register custom injector for a property', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aPropertyMetadata = typeMetadata.propertyMetadataMap.get('a');

        expect(aPropertyMetadata).toBeDefined();
        expect(aPropertyMetadata?.propertyOptions.typeInjector).toBeInstanceOf(SingletonInjector);
    });
});

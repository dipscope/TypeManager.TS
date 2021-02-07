import { Type, TypeArtisan, Property } from './../../src';
import { TypeInjector } from './../../src/helpers';
import { SingletonInjector } from './../../src/injectors';

@Type()
@TypeInjector(new SingletonInjector())
class User
{
    @Property() @TypeInjector(new SingletonInjector()) public name?: string;
}

describe('Type injector decorator', function () 
{
    it('should register custom injector for a type', function ()
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.typeInjector).toBeInstanceOf(SingletonInjector);
    });

    it('should register custom injector for a property', function ()
    {
        const userMetadata     = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.typeInjector).toBeInstanceOf(SingletonInjector);
    });
});

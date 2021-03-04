import { Injector, Property, Type, TypeArtisan } from '../src';
import { SingletonInjector } from '../src/injectors';

@Type()
@Injector(new SingletonInjector())
class User
{
    @Property() @Injector(new SingletonInjector()) public name?: string;
}

describe('Type injector decorator', () =>
{
    it('should register custom injector for a type', () =>
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.injector).toBeInstanceOf(SingletonInjector);
    });

    it('should register custom injector for a property', () =>
    {
        const userMetadata     = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.injector).toBeInstanceOf(SingletonInjector);
    });
});

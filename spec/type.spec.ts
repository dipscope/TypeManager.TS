import { ObjectFactory } from './../src/factories';
import { SingletonInjector } from './../src/injectors';
import { ObjectSerializer } from './../src/serializers';
import { Type, TypeArtisan } from './../src';

@Type({
    alias: 'User:Type',
    customData: { rank: 1 },
    defaultValue: () => new User(),
    useDefaultValue: true,
    useImplicitConversion: false,
    injectable: true,
    factory: new ObjectFactory(),
    injector: new SingletonInjector(),
    serializer: new ObjectSerializer()
})
class User
{
    public name?: string;
}

describe('Type decorator', function () 
{
    it('should register type metadata', function ()
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);
        const typeCtor     = TypeArtisan.typeCtorMap.get('User:Type');

        expect(userMetadata.typeOptions.alias).toBe('User:Type');
        expect(userMetadata.typeOptions.customData).toBeDefined();
        expect(userMetadata.typeOptions.customData?.rank).toBe(1);
        expect(userMetadata.typeOptions.defaultValue).toBeDefined();
        expect(userMetadata.typeOptions.defaultValue()).toBeInstanceOf(User);
        expect(userMetadata.typeOptions.useDefaultValue).toBeTrue();
        expect(userMetadata.typeOptions.useImplicitConversion).toBeFalse();
        expect(userMetadata.typeOptions.injectable).toBeTrue();
        expect(userMetadata.typeOptions.factory).toBeInstanceOf(ObjectFactory);
        expect(userMetadata.typeOptions.injector).toBeInstanceOf(SingletonInjector);
        expect(userMetadata.typeOptions.serializer).toBeInstanceOf(ObjectSerializer);

        expect(typeCtor).toBeDefined();
        expect(typeCtor).toBe(userMetadata.typeCtor);
    });
});

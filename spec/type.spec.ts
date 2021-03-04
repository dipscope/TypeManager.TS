import { Type, TypeArtisan } from '../src';
import { TypeFactory } from '../src/factories';
import { SingletonInjector } from '../src/injectors';
import { TypeSerializer } from '../src/serializers';

@Type({
    alias: 'User:Type',
    customData: { rank: 1 },
    defaultValue: () => new User(),
    useDefaultValue: true,
    useImplicitConversion: false,
    injectable: true,
    factory: new TypeFactory(),
    injector: new SingletonInjector(),
    serializer: new TypeSerializer()
})
class User
{
    public name?: string;
}

describe('Type decorator', () =>
{
    it('should register type metadata', () =>
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
        expect(userMetadata.typeOptions.factory).toBeInstanceOf(TypeFactory);
        expect(userMetadata.typeOptions.injector).toBeInstanceOf(SingletonInjector);
        expect(userMetadata.typeOptions.serializer).toBeInstanceOf(TypeSerializer);

        expect(typeCtor).toBeDefined();
        expect(typeCtor).toBe(userMetadata.typeCtor);
    });
});

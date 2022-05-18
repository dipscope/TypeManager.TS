import { Type, TypeManager } from '../src';
import { TypeFactory } from '../src/factories';
import { SingletonInjector } from '../src/injectors';
import { TypeSerializer } from '../src/serializers';

@Type({
    alias: 'User:Type',
    customData: { rank: 1 },
    deserializedDefaultValue: () => new User(),
    useDefaultValue: true,
    useImplicitConversion: false,
    injectable: true,
    factory: new TypeFactory(),
    injector: new SingletonInjector(),
    serializer: new TypeSerializer(),
    discriminator: 'UserDiscriminator',
    discriminant: 'UserDiscriminant',
    preserveDiscriminator: true
})
class User
{
    public name?: string;
}

describe('Type decorator', () =>
{
    it('should register type metadata', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        const typeFn = TypeManager.typeFnMap.get('User:Type');

        expect(userMetadata.typeOptions.alias).toBe('User:Type');
        expect(userMetadata.typeOptions.customData).toBeDefined();
        expect(userMetadata.typeOptions.customData?.rank).toBe(1);
        expect(userMetadata.typeOptions.deserializedDefaultValue).toBeDefined();
        expect(userMetadata.typeOptions.deserializedDefaultValue()).toBeInstanceOf(User);
        expect(userMetadata.typeOptions.useDefaultValue).toBeTrue();
        expect(userMetadata.typeOptions.useImplicitConversion).toBeFalse();
        expect(userMetadata.typeOptions.injectable).toBeTrue();
        expect(userMetadata.typeOptions.factory).toBeInstanceOf(TypeFactory);
        expect(userMetadata.typeOptions.injector).toBeInstanceOf(SingletonInjector);
        expect(userMetadata.typeOptions.serializer).toBeInstanceOf(TypeSerializer);
        expect(userMetadata.typeOptions.discriminator).toBe('UserDiscriminator');
        expect(userMetadata.typeOptions.discriminant).toBe('UserDiscriminant');
        expect(userMetadata.typeOptions.preserveDiscriminator).toBeTrue();

        expect(typeFn).toBeDefined();
        expect(typeFn).toBe(userMetadata.typeFn);
    });
});

import { AscInjectSorter, DescPropertySorter, SingletonInjector, Type } from '../src';
import { TypeFactory, TypeManager, TypeSerializer } from '../src';

@Type({
    alias: 'User:Type',
    customData: { rank: 1 },
    serializedDefaultValue: () => new User(),
    deserializedDefaultValue: () => new User(),
    preserveNull: false,
    useDefaultValue: true,
    useImplicitConversion: false,
    injectable: true,
    factory: new TypeFactory(),
    injector: new SingletonInjector(),
    serializer: new TypeSerializer(),
    discriminator: 'UserDiscriminator',
    discriminant: 'UserDiscriminant',
    preserveDiscriminator: true,
    propertySorter: new DescPropertySorter(),
    injectSorter: new AscInjectSorter()
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
        expect(userMetadata.typeOptions.serializedDefaultValue).toBeDefined();
        expect(userMetadata.typeOptions.serializedDefaultValue()).toBeInstanceOf(User);
        expect(userMetadata.typeOptions.deserializedDefaultValue).toBeDefined();
        expect(userMetadata.typeOptions.deserializedDefaultValue()).toBeInstanceOf(User);
        expect(userMetadata.typeOptions.preserveNull).toBeFalse();
        expect(userMetadata.typeOptions.useDefaultValue).toBeTrue();
        expect(userMetadata.typeOptions.useImplicitConversion).toBeFalse();
        expect(userMetadata.typeOptions.injectable).toBeTrue();
        expect(userMetadata.typeOptions.factory).toBeInstanceOf(TypeFactory);
        expect(userMetadata.typeOptions.injector).toBeInstanceOf(SingletonInjector);
        expect(userMetadata.typeOptions.serializer).toBeInstanceOf(TypeSerializer);
        expect(userMetadata.typeOptions.discriminator).toBe('UserDiscriminator');
        expect(userMetadata.typeOptions.discriminant).toBe('UserDiscriminant');
        expect(userMetadata.typeOptions.preserveDiscriminator).toBeTrue();
        expect(userMetadata.typeOptions.propertySorter).toBeInstanceOf(DescPropertySorter);
        expect(userMetadata.typeOptions.injectSorter).toBeInstanceOf(AscInjectSorter);
        
        expect(typeFn).toBeDefined();
        expect(typeFn).toBe(userMetadata.typeFn);
    });
});

import { AscInjectSorter, CustomKey, DescPropertySorter, SingletonInjector, Type } from '../src';
import { TypeFactory, TypeManager, TypeSerializer } from '../src';

const rankKey = new CustomKey<number>('rank');

@Type({
    alias: 'User:Type',
    customValueMap: new Map([[rankKey, 1]]),
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

        expect(userMetadata.alias).toBe('User:Type');
        expect(userMetadata.customValueMap.size).toBe(1);
        expect(userMetadata.serializedDefaultValue).toBeDefined();
        expect(userMetadata.serializedDefaultValue).toBeInstanceOf(User);
        expect(userMetadata.deserializedDefaultValue).toBeDefined();
        expect(userMetadata.deserializedDefaultValue).toBeInstanceOf(User);
        expect(userMetadata.preserveNull).toBeFalse();
        expect(userMetadata.useDefaultValue).toBeTrue();
        expect(userMetadata.useImplicitConversion).toBeFalse();
        expect(userMetadata.injectable).toBeTrue();
        expect(userMetadata.factory).toBeInstanceOf(TypeFactory);
        expect(userMetadata.injector).toBeInstanceOf(SingletonInjector);
        expect(userMetadata.serializer).toBeInstanceOf(TypeSerializer);
        expect(userMetadata.discriminator).toBe('UserDiscriminator');
        expect(userMetadata.discriminant).toBe('UserDiscriminant');
        expect(userMetadata.preserveDiscriminator).toBeTrue();
        expect(userMetadata.propertySorter).toBeInstanceOf(DescPropertySorter);
        expect(userMetadata.injectSorter).toBeInstanceOf(AscInjectSorter);
        expect(userMetadata.customValueMap.has(rankKey)).toBeTrue();
        expect(userMetadata.customValueMap.get(rankKey)).toBe(1);
    });
});

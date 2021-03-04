import { Property, TypeArtisan } from '../src';
import { TypeFactory } from '../src/factories';
import { SingletonInjector } from '../src/injectors';
import { TypeSerializer } from '../src/serializers';

class User
{
    @Property() public name?: string;
    @Property('String', { alias: 'my@mail.ru', factory: new TypeFactory() }) public email?: string;
    @Property(() => String, { serializable: true, injector: new SingletonInjector() }) public group?: string;
    @Property({ deserializable: true }) public rank?: number;
    @Property('Number', { defaultValue: 10 }) public priority?: number;
    @Property(() => Number, { useDefaultValue: true }) public loginCount?: number;
    @Property({ useImplicitConversion: true, serializer: new TypeSerializer() }) public active?: boolean;
}

describe('Property decorator', () =>
{
    it('should register type metadata', () =>
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata).toBeDefined();
    });

    it('should register property metadata', () =>
    {
        const userMetadata           = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata       = userMetadata.propertyMetadataMap.get('name');
        const userEmailMetadata      = userMetadata.propertyMetadataMap.get('email');
        const userGroupMetadata      = userMetadata.propertyMetadataMap.get('group');
        const userRankMetadata       = userMetadata.propertyMetadataMap.get('rank');
        const userPriorityMetadata   = userMetadata.propertyMetadataMap.get('priority');
        const userLoginCountMetadata = userMetadata.propertyMetadataMap.get('loginCount');
        const userActiveMetadata     = userMetadata.propertyMetadataMap.get('active');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.name).toBe('name');
        expect(userNameMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.typeArgument).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.factory).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.injector).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.serializer).toBeUndefined();

        expect(userEmailMetadata).toBeDefined();
        expect(userEmailMetadata?.name).toBe('email');
        expect(userEmailMetadata?.propertyOptions.alias).toBe('my@mail.ru');
        expect(userEmailMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.typeArgument).toBeDefined();
        expect(userEmailMetadata?.propertyOptions.factory).toBeInstanceOf(TypeFactory);
        expect(userEmailMetadata?.propertyOptions.injector).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.serializer).toBeUndefined();

        expect(userGroupMetadata).toBeDefined();
        expect(userGroupMetadata?.name).toBe('group');
        expect(userGroupMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.serializable).toBeTrue();
        expect(userGroupMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.typeArgument).toBeDefined();
        expect(userGroupMetadata?.propertyOptions.factory).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.injector).toBeInstanceOf(SingletonInjector);
        expect(userGroupMetadata?.propertyOptions.serializer).toBeUndefined();

        expect(userRankMetadata).toBeDefined();
        expect(userRankMetadata?.name).toBe('rank');
        expect(userRankMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.deserializable).toBeTrue();
        expect(userRankMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.typeArgument).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.factory).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.injector).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.serializer).toBeUndefined();

        expect(userPriorityMetadata).toBeDefined();
        expect(userPriorityMetadata?.name).toBe('priority');
        expect(userPriorityMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.defaultValue).toBe(10);
        expect(userPriorityMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.typeArgument).toBeDefined();
        expect(userPriorityMetadata?.propertyOptions.factory).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.injector).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.serializer).toBeUndefined();

        expect(userLoginCountMetadata).toBeDefined();
        expect(userLoginCountMetadata?.name).toBe('loginCount');
        expect(userLoginCountMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.useDefaultValue).toBeTrue();
        expect(userLoginCountMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.typeArgument).toBeDefined();
        expect(userLoginCountMetadata?.propertyOptions.factory).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.injector).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.serializer).toBeUndefined();

        expect(userActiveMetadata).toBeDefined();
        expect(userActiveMetadata?.name).toBe('active');
        expect(userActiveMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.useImplicitConversion).toBeTrue();
        expect(userActiveMetadata?.propertyOptions.typeArgument).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.factory).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.injector).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.serializer).toBeInstanceOf(TypeSerializer);
    });
});

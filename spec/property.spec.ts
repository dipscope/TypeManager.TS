import { Property, Type, TypeManager, TypeSerializer } from '../src';

@Type()
class User
{
    @Property() public name?: string;
    @Property({ typeArgument: 'String', alias: 'my@mail.ru' }) public email?: string;
    @Property(() => String, { serializable: true }) public group?: string;
    @Property({ deserializable: true, preserveNull: false }) public rank?: number;
    @Property('Number', { deserializedDefaultValue: 10 }) public priority?: number;
    @Property(() => Number, { useDefaultValue: true, customOptions: [] }) public loginCount?: number;
    @Property({ useImplicitConversion: true, serializer: new TypeSerializer() }) public active?: boolean;
}

describe('Property decorator', () =>
{
    it('should register type metadata', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);

        expect(userMetadata).toBeDefined();
    });

    it('should register property metadata', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');
        const userEmailMetadata = userMetadata.propertyMetadataMap.get('email');
        const userGroupMetadata = userMetadata.propertyMetadataMap.get('group');
        const userRankMetadata = userMetadata.propertyMetadataMap.get('rank');
        const userPriorityMetadata = userMetadata.propertyMetadataMap.get('priority');
        const userLoginCountMetadata = userMetadata.propertyMetadataMap.get('loginCount');
        const userActiveMetadata = userMetadata.propertyMetadataMap.get('active');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyName).toBe('name');
        expect(userNameMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.deserializedDefaultValue).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.typeArgument).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.serializer).toBeUndefined();

        expect(userEmailMetadata).toBeDefined();
        expect(userEmailMetadata?.propertyName).toBe('email');
        expect(userEmailMetadata?.propertyOptions.alias).toBe('my@mail.ru');
        expect(userEmailMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.deserializedDefaultValue).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.typeArgument).toBeDefined();
        expect(userEmailMetadata?.propertyOptions.serializer).toBeUndefined();

        expect(userGroupMetadata).toBeDefined();
        expect(userGroupMetadata?.propertyName).toBe('group');
        expect(userGroupMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.serializable).toBeTrue();
        expect(userGroupMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.deserializedDefaultValue).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.typeArgument).toBeDefined();
        expect(userGroupMetadata?.propertyOptions.serializer).toBeUndefined();

        expect(userRankMetadata).toBeDefined();
        expect(userRankMetadata?.propertyName).toBe('rank');
        expect(userRankMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.deserializable).toBeTrue();
        expect(userRankMetadata?.propertyOptions.deserializedDefaultValue).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.preserveNull).toBeFalse();
        expect(userRankMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.typeArgument).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.serializer).toBeUndefined();

        expect(userPriorityMetadata).toBeDefined();
        expect(userPriorityMetadata?.propertyName).toBe('priority');
        expect(userPriorityMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.deserializedDefaultValue).toBe(10);
        expect(userPriorityMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.typeArgument).toBeDefined();
        expect(userPriorityMetadata?.propertyOptions.serializer).toBeUndefined();

        expect(userLoginCountMetadata).toBeDefined();
        expect(userLoginCountMetadata?.propertyName).toBe('loginCount');
        expect(userLoginCountMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.deserializedDefaultValue).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.useDefaultValue).toBeTrue();
        expect(userLoginCountMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.typeArgument).toBeDefined();
        expect(userLoginCountMetadata?.propertyOptions.serializer).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.customOptions).toBeDefined();

        expect(userActiveMetadata).toBeDefined();
        expect(userActiveMetadata?.propertyName).toBe('active');
        expect(userActiveMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.deserializedDefaultValue).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.useImplicitConversion).toBeTrue();
        expect(userActiveMetadata?.propertyOptions.typeArgument).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.serializer).toBeInstanceOf(TypeSerializer);
    });
});

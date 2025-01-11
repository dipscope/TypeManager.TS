import { CustomKey, NumberSerializer, Property, StringSerializer, Type, TypeManager, TypeSerializer, UnknownSerializer } from '../src';

@Type()
class User
{
    @Property() public name?: string;
    @Property({ typeArgument: String, alias: 'my@mail.ru' }) public email?: string;
    @Property(() => String, { serializable: true }) public group?: string;
    @Property({ deserializable: true, preserveNull: false }) public rank?: number;
    @Property(Number, { deserializedDefaultValue: 10, useDefaultValue: true }) public priority?: number;
    @Property(() => Number, { useDefaultValue: true, customValueMap: new Map([[new CustomKey('a'), 1]]) }) public loginCount?: number;
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
        expect(userNameMetadata?.alias).toBeUndefined();
        expect(userNameMetadata?.serializable).toBeTrue();
        expect(userNameMetadata?.deserializable).toBeTrue();
        expect(userNameMetadata?.deserializedDefaultValue).toBeUndefined();
        expect(userNameMetadata?.useDefaultValue).toBeFalse();
        expect(userNameMetadata?.useImplicitConversion).toBeFalse();
        expect(userNameMetadata?.typeArgument).toBeUndefined();
        expect(userNameMetadata?.serializer).toBeInstanceOf(UnknownSerializer);

        expect(userEmailMetadata).toBeDefined();
        expect(userEmailMetadata?.propertyName).toBe('email');
        expect(userEmailMetadata?.alias).toBe('my@mail.ru');
        expect(userEmailMetadata?.serializable).toBeTrue();
        expect(userEmailMetadata?.deserializable).toBeTrue();
        expect(userEmailMetadata?.deserializedDefaultValue).toBeUndefined();
        expect(userEmailMetadata?.useDefaultValue).toBeFalse();
        expect(userEmailMetadata?.useImplicitConversion).toBeFalse();
        expect(userEmailMetadata?.typeArgument).toBeDefined();
        expect(userEmailMetadata?.serializer).toBeInstanceOf(StringSerializer);

        expect(userGroupMetadata).toBeDefined();
        expect(userGroupMetadata?.propertyName).toBe('group');
        expect(userGroupMetadata?.alias).toBeUndefined();
        expect(userGroupMetadata?.serializable).toBeTrue();
        expect(userGroupMetadata?.deserializable).toBeFalse();
        expect(userGroupMetadata?.deserializedDefaultValue).toBeUndefined();
        expect(userGroupMetadata?.useDefaultValue).toBeFalse();
        expect(userGroupMetadata?.useImplicitConversion).toBeFalse();
        expect(userGroupMetadata?.typeArgument).toBeDefined();
        expect(userGroupMetadata?.serializer).toBeInstanceOf(StringSerializer);

        expect(userRankMetadata).toBeDefined();
        expect(userRankMetadata?.propertyName).toBe('rank');
        expect(userRankMetadata?.alias).toBeUndefined();
        expect(userRankMetadata?.serializable).toBeFalse();
        expect(userRankMetadata?.deserializable).toBeTrue();
        expect(userRankMetadata?.deserializedDefaultValue).toBeUndefined();
        expect(userRankMetadata?.preserveNull).toBeFalse();
        expect(userRankMetadata?.useDefaultValue).toBeFalse();
        expect(userRankMetadata?.useImplicitConversion).toBeFalse();
        expect(userRankMetadata?.typeArgument).toBeUndefined();
        expect(userRankMetadata?.serializer).toBeInstanceOf(UnknownSerializer);

        expect(userPriorityMetadata).toBeDefined();
        expect(userPriorityMetadata?.propertyName).toBe('priority');
        expect(userPriorityMetadata?.alias).toBeUndefined();
        expect(userPriorityMetadata?.serializable).toBeTrue();
        expect(userPriorityMetadata?.deserializable).toBeTrue();
        expect(userPriorityMetadata?.deserializedDefaultValue).toBe(10);
        expect(userPriorityMetadata?.useDefaultValue).toBeTrue();
        expect(userPriorityMetadata?.useImplicitConversion).toBeFalse();
        expect(userPriorityMetadata?.typeArgument).toBeDefined();
        expect(userPriorityMetadata?.serializer).toBeInstanceOf(NumberSerializer);

        expect(userLoginCountMetadata).toBeDefined();
        expect(userLoginCountMetadata?.propertyName).toBe('loginCount');
        expect(userLoginCountMetadata?.alias).toBeUndefined();
        expect(userLoginCountMetadata?.serializable).toBeTrue();
        expect(userLoginCountMetadata?.deserializable).toBeTrue();
        expect(userLoginCountMetadata?.deserializedDefaultValue).toBe(0);
        expect(userLoginCountMetadata?.useDefaultValue).toBeTrue();
        expect(userLoginCountMetadata?.useImplicitConversion).toBeFalse();
        expect(userLoginCountMetadata?.typeArgument).toBeDefined();
        expect(userLoginCountMetadata?.serializer).toBeInstanceOf(NumberSerializer);
        expect(userLoginCountMetadata?.customValueMap.size).toBe(1);

        expect(userActiveMetadata).toBeDefined();
        expect(userActiveMetadata?.propertyName).toBe('active');
        expect(userActiveMetadata?.alias).toBeUndefined();
        expect(userActiveMetadata?.serializable).toBeTrue();
        expect(userActiveMetadata?.deserializable).toBeTrue();
        expect(userActiveMetadata?.deserializedDefaultValue).toBeUndefined();
        expect(userActiveMetadata?.useDefaultValue).toBeFalse();
        expect(userActiveMetadata?.useImplicitConversion).toBeTrue();
        expect(userActiveMetadata?.typeArgument).toBeUndefined();
        expect(userActiveMetadata?.serializer).toBeInstanceOf(TypeSerializer);
    });
});

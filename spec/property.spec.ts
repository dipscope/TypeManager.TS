import { Property, TypeArtisan } from './../src';
import { ObjectSerializer } from './../src/serializers';
import { ObjectFactory } from './../src/factories';
import { SingletonInjector } from './../src/injectors';

class User
{
    @Property() public name?: string;
    @Property('String', { alias: 'my@mail.ru', typeFactory: new ObjectFactory() }) public email?: string;
    @Property(() => String, { serializable: true, typeInjector: new SingletonInjector() }) public group?: string;
    @Property({ deserializable: true }) public rank?: number;
    @Property('Number', { defaultValue: 10 }) public priority?: number;
    @Property(() => Number, { useDefaultValue: true }) public loginCount?: number;
    @Property({ useImplicitConversion: true, typeSerializer: new ObjectSerializer() }) public active?: boolean;
}

describe('Property decorator', function () 
{
    it('should register type metadata', function ()
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata).toBeDefined();
    });

    it('should register property metadata', function ()
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
        expect(userNameMetadata?.propertyOptions.typeResolver).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.typeFactory).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.typeInjector).toBeUndefined();
        expect(userNameMetadata?.propertyOptions.typeSerializer).toBeUndefined();

        expect(userEmailMetadata).toBeDefined();
        expect(userEmailMetadata?.name).toBe('email');
        expect(userEmailMetadata?.propertyOptions.alias).toBe('my@mail.ru');
        expect(userEmailMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.typeResolver).toBeDefined();
        expect(userEmailMetadata?.propertyOptions.typeFactory).toBeInstanceOf(ObjectFactory);
        expect(userEmailMetadata?.propertyOptions.typeInjector).toBeUndefined();
        expect(userEmailMetadata?.propertyOptions.typeSerializer).toBeUndefined();

        expect(userGroupMetadata).toBeDefined();
        expect(userGroupMetadata?.name).toBe('group');
        expect(userGroupMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.serializable).toBeTrue();
        expect(userGroupMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.typeResolver).toBeDefined();
        expect(userGroupMetadata?.propertyOptions.typeFactory).toBeUndefined();
        expect(userGroupMetadata?.propertyOptions.typeInjector).toBeInstanceOf(SingletonInjector);
        expect(userGroupMetadata?.propertyOptions.typeSerializer).toBeUndefined();

        expect(userRankMetadata).toBeDefined();
        expect(userRankMetadata?.name).toBe('rank');
        expect(userRankMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.deserializable).toBeTrue();
        expect(userRankMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.typeResolver).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.typeFactory).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.typeInjector).toBeUndefined();
        expect(userRankMetadata?.propertyOptions.typeSerializer).toBeUndefined();

        expect(userPriorityMetadata).toBeDefined();
        expect(userPriorityMetadata?.name).toBe('priority');
        expect(userPriorityMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.defaultValue).toBe(10);
        expect(userPriorityMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.typeResolver).toBeDefined();
        expect(userPriorityMetadata?.propertyOptions.typeFactory).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.typeInjector).toBeUndefined();
        expect(userPriorityMetadata?.propertyOptions.typeSerializer).toBeUndefined();

        expect(userLoginCountMetadata).toBeDefined();
        expect(userLoginCountMetadata?.name).toBe('loginCount');
        expect(userLoginCountMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.useDefaultValue).toBeTrue();
        expect(userLoginCountMetadata?.propertyOptions.useImplicitConversion).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.typeResolver).toBeDefined();
        expect(userLoginCountMetadata?.propertyOptions.typeFactory).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.typeInjector).toBeUndefined();
        expect(userLoginCountMetadata?.propertyOptions.typeSerializer).toBeUndefined();

        expect(userActiveMetadata).toBeDefined();
        expect(userActiveMetadata?.name).toBe('active');
        expect(userActiveMetadata?.propertyOptions.alias).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.serializable).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.deserializable).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.defaultValue).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.useDefaultValue).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.useImplicitConversion).toBeTrue();
        expect(userActiveMetadata?.propertyOptions.typeResolver).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.typeFactory).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.typeInjector).toBeUndefined();
        expect(userActiveMetadata?.propertyOptions.typeSerializer).toBeInstanceOf(ObjectSerializer);
    });
});

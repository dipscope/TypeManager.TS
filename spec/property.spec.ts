import { Entity, EntityBuilder, Property, Attribute, Prop, Attr, Serializable, Deserializable, Model } from './../src';

@Entity()
@Model('X:Property')
class X
{
    @Property() public a?: string;
    @Attribute('e') public b?: string;
    @Prop() @Serializable() public c?: string;
    @Attr() @Deserializable() public d?: string;
}

describe('Property decorator', function () 
{
    it('should register property descriptor in the entity builder', function ()
    {
        const ctorEntityDescriptor = EntityBuilder.entityDescriptorCtorMap.get(X);
        const nameEntityDescriptor = EntityBuilder.entityDescriptorNameMap.get('X:Property');

        expect(ctorEntityDescriptor).toBeDefined();
        expect(nameEntityDescriptor).toBeDefined();

        const aPropertyDescriptor = ctorEntityDescriptor?.propertyDescriptorEntityMap.get('a');
        const bPropertyDescriptor = nameEntityDescriptor?.propertyDescriptorEntityMap.get('b');
        const cPropertyDescriptor = ctorEntityDescriptor?.propertyDescriptorEntityMap.get('c');
        const dPropertyDescriptor = nameEntityDescriptor?.propertyDescriptorEntityMap.get('d');
        const ePropertyDescriptor = ctorEntityDescriptor?.propertyDescriptorObjectMap.get('e');

        expect(aPropertyDescriptor?.propertyName).toBe('a');
        expect(aPropertyDescriptor?.propertyAlias).not.toBeDefined();
        expect(aPropertyDescriptor?.serializable).not.toBeDefined();
        expect(aPropertyDescriptor?.deserializable).not.toBeDefined();

        expect(bPropertyDescriptor?.propertyName).toBe('b');
        expect(bPropertyDescriptor?.propertyAlias).toBe('e');
        expect(bPropertyDescriptor?.serializable).not.toBeDefined();
        expect(bPropertyDescriptor?.deserializable).not.toBeDefined();

        expect(cPropertyDescriptor?.propertyName).toBe('c');
        expect(cPropertyDescriptor?.propertyAlias).not.toBeDefined();
        expect(cPropertyDescriptor?.serializable).toBeTrue();
        expect(cPropertyDescriptor?.deserializable).not.toBeDefined();

        expect(dPropertyDescriptor?.propertyName).toBe('d');
        expect(dPropertyDescriptor?.propertyAlias).not.toBeDefined();
        expect(dPropertyDescriptor?.serializable).not.toBeDefined();
        expect(dPropertyDescriptor?.deserializable).toBeTrue();

        expect(ePropertyDescriptor).toEqual(bPropertyDescriptor);
    });
});

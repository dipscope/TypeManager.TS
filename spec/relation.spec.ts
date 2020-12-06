import { PropertyDescriptor } from '../src/property.metadata';
import { RelationDescriptor } from './../src/relation.descriptor';
import { Entity, EntityBuilder, Property, Relation } from './../src';

@Entity()
class X
{
    @Property() public a?: string;
}

@Entity('Y:Relation')
class Y
{
    @Property() public a?: string;
    @Relation(X) public x?: X;
}

describe('Relation decorator', function () 
{
    it('should register relation descriptor in the entity builder', function ()
    {
        const ctorEntityDescriptor = EntityBuilder.entityDescriptorCtorMap.get(Y);
        const nameEntityDescriptor = EntityBuilder.entityDescriptorNameMap.get('Y:Relation');

        expect(ctorEntityDescriptor).toBeDefined();
        expect(nameEntityDescriptor).toBeDefined();

        const aPropertyDescriptor = ctorEntityDescriptor?.propertyDescriptorEntityMap.get('a');
        const xPropertyDescriptor = nameEntityDescriptor?.propertyDescriptorEntityMap.get('x');

        expect(xPropertyDescriptor).toBeInstanceOf(PropertyDescriptor);
        expect(aPropertyDescriptor?.propertyName).toBe('a');
        expect(aPropertyDescriptor?.propertyAlias).not.toBeDefined();
        expect(aPropertyDescriptor?.serializable).not.toBeDefined();
        expect(aPropertyDescriptor?.deserializable).not.toBeDefined();
        
        expect(xPropertyDescriptor).toBeInstanceOf(RelationDescriptor);
        expect(xPropertyDescriptor?.propertyName).toBe('x');
        expect(xPropertyDescriptor?.propertyAlias).not.toBeDefined();
        expect(xPropertyDescriptor?.serializable).not.toBeDefined();
        expect(xPropertyDescriptor?.deserializable).not.toBeDefined();
    });
});

import { Entity, Model, EntityBuilder } from './../src';

@Entity()
@Model('X:Entity')
class X
{
    public a?: string;
}

describe('Entity decorator', function () 
{
    it('should register entity descriptor in the entity builder', function () 
    {
        const ctorEntityDescriptor = EntityBuilder.entityDescriptorCtorMap.get(X);
        const nameEntityDescriptor = EntityBuilder.entityDescriptorNameMap.get('X:Entity');

        expect(ctorEntityDescriptor).toBeDefined();
        expect(ctorEntityDescriptor?.entityName).toBe('X:Entity');

        expect(nameEntityDescriptor).toBeDefined();
        expect(nameEntityDescriptor?.entityName).toBe('X:Entity');

        expect(ctorEntityDescriptor).toEqual(nameEntityDescriptor);
    });
});

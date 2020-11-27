import { Entity, EntityBuilder, Transform } from './../src';

@Entity()
@Entity('X:Transform')
class X
{
    @Transform(x => x + 'a', x => x + 'b') public a?: string;
}

describe('Transform decorator', function () 
{
    it('should register transform descriptor in the entity builder', function ()
    {
        const ctorEntityDescriptor = EntityBuilder.entityDescriptorCtorMap.get(X);
        const nameEntityDescriptor = EntityBuilder.entityDescriptorNameMap.get('X:Transform');

        expect(ctorEntityDescriptor).toBeDefined();
        expect(nameEntityDescriptor).toBeDefined();

        const aTransformDescriptor = ctorEntityDescriptor?.transformDescriptorMap.get('a');

        expect(aTransformDescriptor?.propertyName).toBe('a');
        expect(aTransformDescriptor?.serializeFn).toBeDefined();
        expect(aTransformDescriptor?.deserializeFn).toBeDefined();
        expect(aTransformDescriptor?.serializeFn('c')).toBe('cb');
        expect(aTransformDescriptor?.deserializeFn('d')).toBe('da');
    });
});

import { EntityBuilder, Entity, Property, Relation, Transform } from './../src';

@Entity()
class X
{
    @Property('c') public a?: string;
    @Property() public b?: string;
}

@Entity('Y:EntityBuilder')
class Y
{
    @Property() @Transform(x => x + x, x => x.split('').shift()) public a?: string;
    @Property('c') public b?: string;
    @Relation(X) public x?: X; 
}

describe('Entity builder', function () 
{
    it('should build entity when JSON object or string is provided and vice versa', function () 
    {
        const baseObject      = { a: 'a', c: 'b', x: { c: 'a', b: 'b' } };
        const baseObjects     = [baseObject, baseObject];
        const baseObjectJson  = JSON.stringify(baseObject);
        const baseObjectsJson = JSON.stringify(baseObjects);

        const entity       = EntityBuilder.buildEntity(Y, baseObject);
        const entities     = EntityBuilder.buildEntity(Y, baseObjects);
        const jsonEntity   = EntityBuilder.buildEntity(Y, baseObjectJson);
        const jsonEntities = EntityBuilder.buildEntity(Y, baseObjectsJson);
        const nullEntity   = EntityBuilder.buildEntity(Y, null);

        expect(entity).toBeInstanceOf(Y);
        expect(entity.a).toBe('aa');
        expect(entity.b).toBe('b');
        expect(entity.x).toBeInstanceOf(X);
        expect(entity.x.a).toBe('a');
        expect(entity.x.b).toBe('b');

        expect(entities).toBeInstanceOf(Array);
        entities.forEach((e: any) => 
        {
            expect(e).toBeInstanceOf(Y);
            expect(e.a).toBe('aa');
            expect(e.b).toBe('b');
            expect(e.x).toBeInstanceOf(X);
            expect(e.x.a).toBe('a');
            expect(e.x.b).toBe('b');
        });

        expect(jsonEntity).toBeInstanceOf(Y);
        expect(jsonEntity.a).toBe('aa');
        expect(jsonEntity.b).toBe('b');
        expect(jsonEntity.x).toBeInstanceOf(X);
        expect(jsonEntity.x.a).toBe('a');
        expect(jsonEntity.x.b).toBe('b');

        expect(jsonEntities).toBeInstanceOf(Array);
        jsonEntities.forEach((e: any) => 
        {
            expect(e).toBeInstanceOf(Y);
            expect(e.a).toBe('aa');
            expect(e.b).toBe('b');
            expect(e.x).toBeInstanceOf(X);
            expect(e.x.a).toBe('a');
            expect(e.x.b).toBe('b');
        });

        expect(nullEntity).toBeNull();

        const object      = EntityBuilder.buildObject(Y, entity);
        const objects     = EntityBuilder.buildObject(Y, entities);
        const objectJson  = EntityBuilder.buildJson(Y, jsonEntity);
        const objectsJson = EntityBuilder.buildJson(Y, jsonEntities);
        const nullObject  = EntityBuilder.buildJson(Y, null);

        expect(object).toBeInstanceOf(Object);
        expect(object.a).toBe('a');
        expect(object.c).toBe('b');
        expect(object.x).toBeInstanceOf(Object);
        expect(object.x.c).toBe('a');
        expect(object.x.b).toBe('b');

        expect(objects).toBeInstanceOf(Array);
        objects.forEach((o: any) => 
        {
            expect(o).toBeInstanceOf(Object);
            expect(o.a).toBe('a');
            expect(o.c).toBe('b');
            expect(o.x).toBeInstanceOf(Object);
            expect(o.x.c).toBe('a');
            expect(o.x.b).toBe('b');
        });

        expect(objectJson).toBe(baseObjectJson);
        expect(objectsJson).toBe(baseObjectsJson);

        expect(nullObject).toBeNull();
    });
});

import { Type, Property, TypeSerializer, TypeManager } from './../src';

class ASerializer implements TypeSerializer
{
    public serialize(x: string): string
    {
        return x.split('').shift()!;
    }

    public deserialize(x: string): string
    {
        return x + x;
    }
}

@Type()
class X
{
    @Property({ alias: 'c' }) public a?: string;
    @Property() public b?: string;
    @Property({ defaultValue: 'd', useDefaultValue: true }) public d?: string;
    @Property({ defaultValue: () => 'e', useDefaultValue: true }) public e?: string;
    @Property({ useImplicitConversion: true }) public f?: string;
    @Property({ serializable: true }) public g?: string;
    @Property({ deserializable: true }) public h?: string;
}

@Type()
class Y
{
    @Property(() => String, { typeSerializer: new ASerializer() }) public a?: string;
    @Property(() => String, { alias: 'c'}) public b?: string;
    @Property(() => X) public x?: X; 
}

@Type()
class Z 
{
    @Property(() => String) public a?: string;
    @Property(() => X) public x?: X;
}

describe('Type manager', function ()
{
    it('should deserialize type when object is provided and vice versa', function () 
    {
        const yTypeManager = new TypeManager(Y);
        const baseObject   = { a: 'a', c: 'b', x: { c: 'a', b: 'b', f: null, g: 'g', h: 'h' } };
        const baseObjects  = [baseObject, baseObject];

        TypeManager.configure({
            typeOptionsBase : {
                defaultValue: undefined,
                useDefaultValue: false
            }
        });

        const entity     = yTypeManager.deserialize(baseObject);
        const entities   = yTypeManager.deserialize(baseObjects);
        const nullEntity = yTypeManager.deserialize(null);

        expect(entity).toBeInstanceOf(Y);
        expect(entity.a).toBe('aa');
        expect(entity.b).toBe('b');
        expect(entity.x).toBeInstanceOf(X);
        expect(entity.x.a).toBe('a');
        expect(entity.x.b).toBe('b');
        expect(entity.x.d).toBe('d');
        expect(entity.x.e).toBe('e');
        expect(entity.x.f).toBeNull();
        expect(entity.x.g).toBeUndefined(); 
        expect(entity.x.h).toBe('h');

        expect(entities).toBeInstanceOf(Array);
        expect(entities[0]).toEqual(entities[1]);

        entities.forEach((e: any) => 
        {
            expect(e).toBeInstanceOf(Y);
            expect(e.a).toBe('aa');
            expect(e.b).toBe('b');
            expect(e.x).toBeInstanceOf(X);
            expect(e.x.a).toBe('a');
            expect(e.x.b).toBe('b');
            expect(e.x.d).toBe('d');
            expect(e.x.e).toBe('e');
            expect(e.x.f).toBeNull();
            expect(e.x.g).toBeUndefined();
            expect(e.x.h).toBe('h');
        });

        expect(nullEntity).toBeNull();

        entity.x.g      = 'g';
        entities[0].x.g = 'g';
        entities[1].x.g = 'g';

        const object     = yTypeManager.serialize(entity);
        const objects    = yTypeManager.serialize(entities);
        const nullObject = yTypeManager.serialize(null);

        expect(object).toBeInstanceOf(Object);
        expect(object.a).toBe('a');
        expect(object.c).toBe('b');
        expect(object.x).toBeInstanceOf(Object);
        expect(object.x.c).toBe('a');
        expect(object.x.b).toBe('b');
        expect(object.x.d).toBe('d');
        expect(object.x.e).toBe('e');
        expect(object.x.f).toBeNull();
        expect(object.x.g).toBe('g');
        expect(object.x.h).toBeUndefined();

        expect(objects).toBeInstanceOf(Array);
        expect(objects[0]).toEqual(objects[1]);

        objects.forEach((o: any) => 
        {
            expect(o).toBeInstanceOf(Object);
            expect(o.a).toBe('a');
            expect(o.c).toBe('b');
            expect(o.x).toBeInstanceOf(Object);
            expect(o.x.c).toBe('a');
            expect(o.x.b).toBe('b');
            expect(o.x.d).toBe('d');
            expect(o.x.e).toBe('e');
            expect(o.x.f).toBeNull();
            expect(o.x.g).toBe('g');
            expect(o.x.h).toBeUndefined();
        });

        expect(nullObject).toBeNull();
    });

    it('should use base type default value when it is enabled', function ()
    {
        const zTypeManager = new TypeManager(Z);
        const baseObject   = { a: 'a' };

        TypeManager.configure({
            typeOptionsBase : {
                defaultValue: 'x',
                useDefaultValue: true
            }
        });

        const entity = zTypeManager.deserialize(baseObject);

        expect(entity).toBeInstanceOf(Z);
        expect(entity.a).toBe('a');
        expect(entity.x).toBe('x');

        entity.x = undefined;

        const object = zTypeManager.serialize(entity);

        expect(object).toBeInstanceOf(Object);
        expect(object.a).toBe('a');
        expect(object.x).toBe('x');
    });

    it('should not use base type default value when it is disabled', function () 
    {
        const zTypeManager = new TypeManager(Z);
        const baseObject   = { a: 'a' };

        TypeManager.configure({ 
            typeOptionsBase : {
                defaultValue: 'x',
                useDefaultValue: false
            }
        });

        const entity = zTypeManager.deserialize(baseObject);

        expect(entity).toBeInstanceOf(Z);
        expect(entity.a).toBe('a');
        expect(entity.x).toBeUndefined();

        const object = zTypeManager.serialize(entity);

        expect(object).toBeInstanceOf(Object);
        expect(object.a).toBe('a');
        expect(object.x).toBeUndefined();
    });
});

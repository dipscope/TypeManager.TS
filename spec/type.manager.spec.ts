import { Type, Property, Alias, TypeSerializer, Serializer, TypeManager, DefaultValue, UseDefaultValue, UseImplicitConversion } from './../src';

class ASerializer extends TypeSerializer
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
    @Property() @Alias('c') public a?: string;
    @Property() public b?: string;
    @Property() @DefaultValue('d') @UseDefaultValue() public d?: string;
    @Property() @DefaultValue(() => 'e') @UseDefaultValue() public e?: string;
    @Property() @UseImplicitConversion() public f?: string;
}

@Type()
class Y
{
    @Property() @Serializer(new ASerializer()) public a?: string;
    @Property() @Alias('c') public b?: string;
    @Property(() => X) public x?: X; 
}

describe('Type manager', function ()
{
    it('should deserialize type when object is provided and vice versa', function () 
    {
        const yTypeManager = new TypeManager(Y);
        const baseObject   = { a: 'a', c: 'b', x: { c: 'a', b: 'b' } };
        const baseObjects  = [baseObject, baseObject];

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
        expect(entity.x.f).not.toBeDefined();

        expect(entities).toBeInstanceOf(Array);
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
            expect(e.x.f).not.toBeDefined();
        });

        expect(nullEntity).toBeNull();

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
        expect(object.x.f).not.toBeDefined();

        expect(objects).toBeInstanceOf(Array);
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
            expect(o.x.f).not.toBeDefined();
        });

        expect(nullObject).toBeNull();
    });
});

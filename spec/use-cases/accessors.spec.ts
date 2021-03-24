import { Property, Type, TypeManager } from '../../src';

@Type()
class User
{
    private _name?: string;
    private _rank?: number;

    @Property(String) public get name(): string | undefined
    {
        return this._name;
    }

    public set name(name: string | undefined)
    {
        this._name = name;

        return;
    }

    @Property(Number) public get rank(): number | undefined
    {
        return this._rank;
    }

    public set rank(rank: number | undefined)
    {
        this._rank = rank;

        return;
    }
}

describe('Accessors', () =>
{
    it('should be properly serialized', () =>
    {
        const user = new User();

        user.name = 'Dmitry';
        user.rank = 100;

        const result = TypeManager.serialize(User, user);

        expect(result).toBeInstanceOf(Object);
        expect(result.name).toBe('Dmitry');
        expect(result.rank).toBe(100);
    });

    it('should be properly deserialized', () =>
    {
        const user = {} as Record<string, any>;

        user.name = 'Dmitry';
        user.rank = 100;

        const result = TypeManager.deserialize(User, user);

        expect(result).toBeInstanceOf(User);
        expect(result.name).toBe('Dmitry');
        expect(result.rank).toBe(100);
    });
});

import { Inject, Property, Type, TypeManager } from '../../src';

@Type()
class User
{
    @Property(Number, { getInterceptor: (v: number) =>
    {
        return v + 1;
    }, serializable: true, deserializable: true }) 
    public rank: number;

    @Property(String, { setInterceptor: (v: string, user: User) =>
    {
        user.name = { ru: v, en: user.nameEn, de: user.nameDe };

        return v;
    }, serializable: true, deserializable: true }) 
    public nameRu: string;

    @Property(String, { setInterceptor: (v: string, user: User) =>
    {
        user.name = { ru: user.nameRu, en: v, de: user.nameDe };

        return v;
    }, serializable: true, deserializable: true }) 
    public nameEn: string;

    @Property(String, { setInterceptor: (v: string, user: User) =>
    {
        user.name = { ru: user.nameRu, en: user.nameEn, de: v };

        return v;
    }, serializable: true, deserializable: true }) 
    public nameDe: string;

    public name: { ru: string, en: string, de: string };
    public accessorRank: number;

    public constructor(
        @Inject('rank') rank: number, 
        @Inject('nameRu') nameRu: string, 
        @Inject('nameEn') nameEn: string, 
        @Inject('nameDe') nameDe: string
    )
    {
        this.rank = rank;
        this.nameRu = nameRu;
        this.nameEn = nameEn;
        this.nameDe = nameDe;
        this.name = { ru: nameRu, en: nameEn, de: nameDe };
        this.accessorRank = 4;

        return;
    }

    @Property(Number, { getInterceptor: (v: number) =>
    {
        return v + 1;
    }, serializable: false, deserializable: false }) 
    public get otherRank(): number
    {
        return this.accessorRank;
    }

    @Property(Number, { setInterceptor: (v: number) =>
    {
        return v - 1;
    }, serializable: false, deserializable: false }) 
    public set backRank(v: number)
    {
        this.accessorRank = v;

        return;
    }
}

describe('Property interceptors', () =>
{
    it('should intercept getter', () =>
    {
        const userJson = { rank: 1, nameRu: 'Дмитрий', nameEn: 'Dmitry', nameDe: 'Dimitri' };
        const user = TypeManager.deserialize(User, userJson);

        expect(user).toBeInstanceOf(User);
        expect(user.rank).toBe(2);
        expect(user.otherRank).toBe(5);
    });

    it('should intercept setter', () =>
    {
        const userJson = { rank: 1, nameRu: 'Дмитрий', nameEn: 'Dmitry', nameDe: 'Dimitri' };
        const user = TypeManager.deserialize(User, userJson);

        expect(user).toBeInstanceOf(User);
        expect(user.name.ru).toBe('Дмитрий');
        expect(user.name.en).toBe('Dmitry');
        expect(user.name.de).toBe('Dimitri');

        user.nameRu = 'XДмитрийX';
        user.nameEn = 'XDmitryX';
        user.nameDe = 'XDimitriX';

        expect(user.name.ru).toBe('XДмитрийX');
        expect(user.name.en).toBe('XDmitryX');
        expect(user.name.de).toBe('XDimitriX');

        user.backRank = 10;

        expect(user.accessorRank).toBe(9);
        expect(user.otherRank).toBe(10);
    });
});

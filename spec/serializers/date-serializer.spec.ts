import { TypeManager } from '../../src';

describe('Date serializer', () =>
{
    afterEach(() =>
    {
        TypeManager.configureTypeOptionsBase({
            useDefaultValue: false,
            useImplicitConversion: false
        });
    });

    it('should serialize undefined to undefined', () =>
    {
        const value = undefined;
        const result = TypeManager.serialize(Date, value);
        
        expect(result).toBeUndefined();
    });

    it('should deserialize undefined to undefined', () =>
    {
        const value = undefined;
        const result = TypeManager.deserialize(Date, value);
        
        expect(result).toBeUndefined();
    });

    it('should serialize null to null', () =>
    {
        const value = null;
        const result = TypeManager.serialize(Date, value);
        
        expect(result).toBeNull();
    });

    it('should deserialize null to null', () =>
    {
        const value = null;
        const result = TypeManager.deserialize(Date, value);
        
        expect(result).toBeNull();
    });

    it('should serialize date to ISO string', () =>
    {
        const value = new Date('2021-02-22T20:00:00.000Z');
        const result = TypeManager.serialize(Date, value);
        
        expect(result).toBe('2021-02-22T20:00:00.000Z');
    });

    it('should deserialize ISO string to date', () =>
    {
        const value = '2021-02-22T20:00:00.000Z';
        const result = TypeManager.deserialize(Date, value);
        
        expect(result).toBeInstanceOf(Date);
        expect(result.toISOString()).toBe('2021-02-22T20:00:00.000Z');
    });

    it('should serialize date array to ISO string array', () =>
    {
        const value = [new Date('2021-02-22T20:00:00.000Z'), new Date('2021-02-22T21:00:00.000Z')];
        const result = TypeManager.serialize(Date, value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe('2021-02-22T20:00:00.000Z');
        expect(result[1]).toBe('2021-02-22T21:00:00.000Z');
    });

    it('should deserialize ISO string array to date array', () =>
    {
        const value = ['2021-02-22T20:00:00.000Z', '2021-02-22T21:00:00.000Z'];
        const result = TypeManager.deserialize(Date, value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeInstanceOf(Date);
        expect(result[0].toISOString()).toBe('2021-02-22T20:00:00.000Z');
        expect(result[1]).toBeInstanceOf(Date);
        expect(result[1].toISOString()).toBe('2021-02-22T21:00:00.000Z');
    });
});

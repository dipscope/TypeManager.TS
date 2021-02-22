import { TypeManager } from './../../src';

describe('Date serializer', function ()
{
    it('should serialize undefined to undefined', function ()
    {
        const typeManager = new TypeManager(Date);
        const value       = undefined;
        const result      = typeManager.serialize(value);
        
        expect(result).toBeUndefined();
    });

    it('should deserialize undefined to undefined', function ()
    {
        const typeManager = new TypeManager(Date);
        const value       = undefined;
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeUndefined();
    });

    it('should serialize null to null', function ()
    {
        const typeManager = new TypeManager(Date);
        const value       = null;
        const result      = typeManager.serialize(value);
        
        expect(result).toBeNull();
    });

    it('should deserialize null to null', function ()
    {
        const typeManager = new TypeManager(Date);
        const value       = null;
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeNull();
    });

    it('should serialize date to ISO string', function ()
    {
        const typeManager = new TypeManager(Date);
        const value       = new Date('2021-02-22T20:00:00.000Z');
        const result      = typeManager.serialize(value);
        
        expect(result).toBe('2021-02-22T20:00:00.000Z');
    });

    it('should deserialize ISO string to date', function ()
    {
        const typeManager = new TypeManager(Date);
        const value       = '2021-02-22T20:00:00.000Z';
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeInstanceOf(Date);
        expect(result.toISOString()).toBe('2021-02-22T20:00:00.000Z');
    });

    it('should serialize date array to ISO string array', function ()
    {
        const typeManager = new TypeManager(Date);
        const value       = [new Date('2021-02-22T20:00:00.000Z'), new Date('2021-02-22T21:00:00.000Z')];
        const result      = typeManager.serialize(value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe('2021-02-22T20:00:00.000Z');
        expect(result[1]).toBe('2021-02-22T21:00:00.000Z');
    });

    it('should deserialize ISO string array to date array', function ()
    {
        const typeManager = new TypeManager(Date);
        const value       = ['2021-02-22T20:00:00.000Z', '2021-02-22T21:00:00.000Z'];
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeInstanceOf(Date);
        expect(result[0].toISOString()).toBe('2021-02-22T20:00:00.000Z');
        expect(result[1]).toBeInstanceOf(Date);
        expect(result[1].toISOString()).toBe('2021-02-22T21:00:00.000Z');
    });
});

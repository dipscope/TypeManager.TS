import { TypeManager } from './../../src';

describe('Number serializer', function () 
{
    it('should serialize undefined to undefined', function ()
    {
        const typeManager = new TypeManager(Number);
        const value       = undefined;
        const result      = typeManager.serialize(value);
        
        expect(result).toBeUndefined();
    });

    it('should deserialize undefined to undefined', function ()
    {
        const typeManager = new TypeManager(Number);
        const value       = undefined;
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeUndefined();
    });

    it('should serialize null to null', function ()
    {
        const typeManager = new TypeManager(Number);
        const value       = null;
        const result      = typeManager.serialize(value);
        
        expect(result).toBeNull();
    });

    it('should deserialize null to null', function ()
    {
        const typeManager = new TypeManager(Number);
        const value       = null;
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeNull();
    });

    it('should serialize number to number', function ()
    {
        const typeManager = new TypeManager(Number);
        const value       = 12.5;
        const result      = typeManager.serialize(value);
        
        expect(result).toBe(12.5);
    });

    it('should deserialize number to number', function ()
    {
        const typeManager = new TypeManager(Number);
        const value       = 12.5;
        const result      = typeManager.deserialize(value);
        
        expect(result).toBe(12.5);
    });

    it('should serialize number array to number array', function ()
    {
        const typeManager = new TypeManager(Number);
        const value       = [12.5, -12.5];
        const result      = typeManager.serialize(value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe(12.5);
        expect(result[1]).toBe(-12.5);
    });

    it('should deserialize number array to number array', function ()
    {
        const typeManager = new TypeManager(Number);
        const value       = [12.5, -12.5];
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe(12.5);
        expect(result[1]).toBe(-12.5);
    });

    it('should serialize suitable types to number when implicit conversion is enabled', function ()
    {
        const typeManager = new TypeManager(Number, { useImplicitConversion: true });
        const value       = ['12.5', '-12.5', true, false] as any[];
        const result      = typeManager.serialize(value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe(12.5);
        expect(result[1]).toBe(-12.5);
        expect(result[2]).toBe(1);
        expect(result[3]).toBe(0);
    });

    it('should deserialize suitable types to number when implicit conversion is enabled', function ()
    {
        const typeManager = new TypeManager(Number, { useImplicitConversion: true });
        const value       = ['12.5', '-12.5', true, false] as any[];
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe(12.5);
        expect(result[1]).toBe(-12.5);
        expect(result[2]).toBe(1);
        expect(result[3]).toBe(0);
    });
});

import { TypeManager } from './../../src';

describe('Boolean serializer', function () 
{
    it('should serialize undefined to undefined', function ()
    {
        const typeManager = new TypeManager(Boolean);
        const value       = undefined;
        const result      = typeManager.serialize(value);
        
        expect(result).toBeUndefined();
    });

    it('should deserialize undefined to undefined', function ()
    {
        const typeManager = new TypeManager(Boolean);
        const value       = undefined;
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeUndefined();
    });

    it('should serialize null to null', function ()
    {
        const typeManager = new TypeManager(Boolean);
        const value       = null;
        const result      = typeManager.serialize(value);
        
        expect(result).toBeNull();
    });

    it('should deserialize null to null', function ()
    {
        const typeManager = new TypeManager(Boolean);
        const value       = null;
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeNull();
    });

    it('should serialize boolean to boolean', function ()
    {
        const typeManager = new TypeManager(Boolean);
        const value       = true;
        const result      = typeManager.serialize(value);
        
        expect(result).toBeTrue();
    });

    it('should deserialize boolean to boolean', function ()
    {
        const typeManager = new TypeManager(Boolean);
        const value       = true;
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeTrue();
    });

    it('should serialize boolean array to boolean array', function ()
    {
        const typeManager = new TypeManager(Boolean);
        const value       = [true, false];
        const result      = typeManager.serialize(value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeTrue();
        expect(result[1]).toBeFalse();
    });

    it('should deserialize boolean array to boolean array', function ()
    {
        const typeManager = new TypeManager(Boolean);
        const value       = [true, false];
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeTrue();
        expect(result[1]).toBeFalse();
    });

    it('should serialize suitable types to boolean when implicit conversion is enabled', function ()
    {
        const typeManager = new TypeManager(Boolean, { useImplicitConversion: true });
        const value       = ['0', '1', 0, 1] as any[];
        const result      = typeManager.serialize(value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeFalse();
        expect(result[1]).toBeTrue();
        expect(result[2]).toBeFalse();
        expect(result[3]).toBeTrue();
        expect(result[4]).toBeUndefined();
    });

    it('should deserialize suitable types to boolean when implicit conversion is enabled', function ()
    {
        const typeManager = new TypeManager(Boolean, { useImplicitConversion: true });
        const value       = ['0', '1', 0, 1] as any[];
        const result      = typeManager.deserialize(value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeFalse();
        expect(result[1]).toBeTrue();
        expect(result[2]).toBeFalse();
        expect(result[3]).toBeTrue();
        expect(result[4]).toBeUndefined();
    });
});

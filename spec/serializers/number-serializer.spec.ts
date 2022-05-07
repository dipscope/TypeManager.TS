import { TypeManager } from '../../src';

describe('Number serializer', () =>
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
        const result = TypeManager.serialize(Number, value);
        
        expect(result).toBeUndefined();
    });

    it('should deserialize undefined to undefined', () =>
    {
        const value = undefined;
        const result = TypeManager.deserialize(Number, value);
        
        expect(result).toBeUndefined();
    });

    it('should serialize null to null', () =>
    {
        const value = null;
        const result = TypeManager.serialize(Number, value);

        expect(result).toBeNull();
    });

    it('should deserialize null to null', () =>
    {
        const value = null;
        const result = TypeManager.deserialize(Number, value);
        
        expect(result).toBeNull();
    });

    it('should serialize number to number', () =>
    {
        const value = 12.5;
        const result = TypeManager.serialize(Number, value);
        
        expect(result).toBe(12.5);
    });

    it('should deserialize number to number', () =>
    {
        const value = 12.5;
        const result = TypeManager.deserialize(Number, value);
        
        expect(result).toBe(12.5);
    });

    it('should serialize number array to number array', () =>
    {
        const value = [12.5, -12.5];
        const result = TypeManager.serialize(Number, value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe(12.5);
        expect(result[1]).toBe(-12.5);
    });

    it('should deserialize number array to number array', () =>
    {
        const value = [12.5, -12.5];
        const result = TypeManager.deserialize(Number, value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe(12.5);
        expect(result[1]).toBe(-12.5);
    });

    it('should serialize suitable types to number when implicit conversion is enabled', () =>
    {
        TypeManager.configureTypeOptionsBase({ 
            useImplicitConversion: true 
        });

        const value = ['12.5', '-12.5', true, false] as any[];
        const result = TypeManager.serialize(Number, value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe(12.5);
        expect(result[1]).toBe(-12.5);
        expect(result[2]).toBe(1);
        expect(result[3]).toBe(0);
    });

    it('should deserialize suitable types to number when implicit conversion is enabled', () =>
    {
        TypeManager.configureTypeOptionsBase({ 
            useImplicitConversion: true 
        });

        const value = ['12.5', '-12.5', true, false] as any[];
        const result = TypeManager.deserialize(Number, value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe(12.5);
        expect(result[1]).toBe(-12.5);
        expect(result[2]).toBe(1);
        expect(result[3]).toBe(0);
    });
});

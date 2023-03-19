import { TypeManager } from '../../src';

describe('String serializer', () => 
{
    afterEach(() =>
    {
        TypeManager.applyTypeOptionsBase({
            useDefaultValue: false,
            useImplicitConversion: false
        });
    });

    it('should serialize undefined to undefined', () =>
    {
        const value = undefined;
        const result = TypeManager.serialize(String, value);
        
        expect(result).toBeUndefined();
    });

    it('should deserialize undefined to undefined', () =>
    {
        const value = undefined;
        const result = TypeManager.deserialize(String, value);
        
        expect(result).toBeUndefined();
    });

    it('should serialize null to null', () =>
    {
        const value = null;
        const result = TypeManager.serialize(String, value);
        
        expect(result).toBeNull();
    });

    it('should deserialize null to null', () =>
    {
        const value = null;
        const result = TypeManager.deserialize(String, value);
        
        expect(result).toBeNull();
    });

    it('should serialize string to string', () =>
    {
        const value = 'x';
        const result = TypeManager.serialize(String, value);
        
        expect(result).toBe('x');
    });

    it('should deserialize string to string', () =>
    {
        const value = 'x';
        const result = TypeManager.deserialize(String, value);
        
        expect(result).toBe('x');
    });

    it('should serialize string array to string array', () =>
    {
        const value = ['x', 'y'];
        const result = TypeManager.serialize(String, value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe('x');
        expect(result[1]).toBe('y');
    });

    it('should deserialize string array to string array', () =>
    {
        const value = ['x', 'y'];
        const result = TypeManager.deserialize(String, value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe('x');
        expect(result[1]).toBe('y');
    });

    it('should serialize suitable types to string when implicit conversion is enabled', () =>
    {
        TypeManager.applyTypeOptionsBase({ 
            useImplicitConversion: true 
        });

        const value = [12.5, -12.5, true, false] as any[];
        const result = TypeManager.serialize(String, value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe('12.5');
        expect(result[1]).toBe('-12.5');
        expect(result[2]).toBe('true');
        expect(result[3]).toBe('false');
    });

    it('should deserialize suitable types to string when implicit conversion is enabled', () =>
    {
        TypeManager.applyTypeOptionsBase({ 
            useImplicitConversion: true 
        });

        const value = [12.5, -12.5, true, false] as any[];
        const result = TypeManager.deserialize(String, value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBe('12.5');
        expect(result[1]).toBe('-12.5');
        expect(result[2]).toBe('true');
        expect(result[3]).toBe('false');
    });
});

import { TypeManager } from '../../src';

describe('Boolean serializer', () =>
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
        const result = TypeManager.serialize(Boolean, value);
        
        expect(result).toBeUndefined();
    });

    it('should deserialize undefined to undefined', () =>
    {
        const value = undefined;
        const result = TypeManager.deserialize(Boolean, value);
        
        expect(result).toBeUndefined();
    });

    it('should serialize null to null', () =>
    {
        const value = null;
        const result = TypeManager.serialize(Boolean, value);
        
        expect(result).toBeNull();
    });

    it('should deserialize null to null', () =>
    {
        const value = null;
        const result = TypeManager.deserialize(Boolean, value);
        
        expect(result).toBeNull();
    });

    it('should serialize boolean to boolean', () =>
    {
        const value = true;
        const result = TypeManager.serialize(Boolean, value);
        
        expect(result).toBeTrue();
    });

    it('should deserialize boolean to boolean', () =>
    {
        const value = true;
        const result = TypeManager.deserialize(Boolean, value);
        
        expect(result).toBeTrue();
    });

    it('should serialize boolean array to boolean array', () =>
    {
        const value = [true, false];
        const result = TypeManager.serialize(Boolean, value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeTrue();
        expect(result[1]).toBeFalse();
    });

    it('should deserialize boolean array to boolean array', () =>
    {
        const value = [true, false];
        const result = TypeManager.deserialize(Boolean, value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeTrue();
        expect(result[1]).toBeFalse();
    });

    it('should serialize suitable types to boolean when implicit conversion is enabled', () =>
    {
        TypeManager.configureTypeOptionsBase({ 
            useImplicitConversion: true 
        });

        const value = ['true', 'false', '1', '0', 1, 0] as any[];
        const result = TypeManager.serialize(Boolean, value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeTrue();
        expect(result[1]).toBeFalse();
        expect(result[2]).toBeTrue();
        expect(result[3]).toBeFalse();
        expect(result[4]).toBeTrue();
        expect(result[5]).toBeFalse();
    });

    it('should deserialize suitable types to boolean when implicit conversion is enabled', () =>
    {
        TypeManager.configureTypeOptionsBase({ 
            useImplicitConversion: true 
        });

        const value = ['true', 'false', '1', '0', 1, 0] as any[];
        const result = TypeManager.deserialize(Boolean, value);
        
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeTrue();
        expect(result[1]).toBeFalse();
        expect(result[2]).toBeTrue();
        expect(result[3]).toBeFalse();
        expect(result[4]).toBeTrue();
        expect(result[5]).toBeFalse();
    });
});

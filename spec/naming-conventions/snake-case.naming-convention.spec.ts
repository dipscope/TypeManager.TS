import { SnakeCaseNamingConvention } from './../../src/naming-conventions';

describe('Snake case naming convention', function () 
{
    it('should convert camelCase to camel_case', function ()
    {
        const namingConvention = new SnakeCaseNamingConvention();

        expect(namingConvention.convert('camelCase')).toBe('camel_case');
    });

    it('should convert snake_case to snake_case', function ()
    {
        const namingConvention = new SnakeCaseNamingConvention();

        expect(namingConvention.convert('snake_case')).toBe('snake_case');
    });

    it('should convert SNAKE_UPPER_CASE to snake_upper_case', function ()
    {
        const namingConvention = new SnakeCaseNamingConvention();

        expect(namingConvention.convert('SNAKE_UPPER_CASE')).toBe('snake_upper_case');
    });

    it('should convert kebab-case to kebab_case', function ()
    {
        const namingConvention = new SnakeCaseNamingConvention();
        
        expect(namingConvention.convert('kebab-case')).toBe('kebab_case');
    });

    it('should convert KEBAB-UPPER-CASE to kebab_upper_case', function ()
    {
        const namingConvention = new SnakeCaseNamingConvention();
        
        expect(namingConvention.convert('KEBAB-UPPER-CASE')).toBe('kebab_upper_case');
    });

    it('should convert PascalCase to pascal_case', function ()
    {
        const namingConvention = new SnakeCaseNamingConvention();
        
        expect(namingConvention.convert('PascalCase')).toBe('pascal_case');
    });
});

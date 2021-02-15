import { PascalCaseNamingConvention } from './../../src/naming-conventions';

describe('Pascal case naming convention', function () 
{
    it('should convert camelCase to CamelCase', function ()
    {
        const namingConvention = new PascalCaseNamingConvention();

        expect(namingConvention.convert('camelCase')).toBe('CamelCase');
    });

    it('should convert snake_case to SnakeCase', function ()
    {
        const namingConvention = new PascalCaseNamingConvention();

        expect(namingConvention.convert('snake_case')).toBe('SnakeCase');
    });

    it('should convert SNAKE_UPPER_CASE to SnakeUpperCase', function ()
    {
        const namingConvention = new PascalCaseNamingConvention();

        expect(namingConvention.convert('SNAKE_UPPER_CASE')).toBe('SnakeUpperCase');
    });

    it('should convert kebab-case to KebabCase', function ()
    {
        const namingConvention = new PascalCaseNamingConvention();
        
        expect(namingConvention.convert('kebab-case')).toBe('KebabCase');
    });

    it('should convert KEBAB-UPPER-CASE to KebabUpperCase', function ()
    {
        const namingConvention = new PascalCaseNamingConvention();
        
        expect(namingConvention.convert('KEBAB-UPPER-CASE')).toBe('KebabUpperCase');
    });

    it('should convert PascalCase to PascalCase', function ()
    {
        const namingConvention = new PascalCaseNamingConvention();
        
        expect(namingConvention.convert('PascalCase')).toBe('PascalCase');
    });
});

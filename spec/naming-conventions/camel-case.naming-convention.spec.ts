import { CamelCaseNamingConvention } from './../../src/naming-conventions';

describe('Camel case naming convention', function () 
{
    it('should convert camelCase to camelCase', function ()
    {
        const namingConvention = new CamelCaseNamingConvention();

        expect(namingConvention.convert('camelCase')).toBe('camelCase');
    });

    it('should convert snake_case to snakeCase', function ()
    {
        const namingConvention = new CamelCaseNamingConvention();

        expect(namingConvention.convert('snake_case')).toBe('snakeCase');
    });

    it('should convert SNAKE_UPPER_CASE to snakeUpperCase', function ()
    {
        const namingConvention = new CamelCaseNamingConvention();

        expect(namingConvention.convert('SNAKE_UPPER_CASE')).toBe('snakeUpperCase');
    });

    it('should convert kebab-case to kebabCase', function ()
    {
        const namingConvention = new CamelCaseNamingConvention();
        
        expect(namingConvention.convert('kebab-case')).toBe('kebabCase');
    });

    it('should convert KEBAB-UPPER-CASE to kebabUpperCase', function ()
    {
        const namingConvention = new CamelCaseNamingConvention();
        
        expect(namingConvention.convert('KEBAB-UPPER-CASE')).toBe('kebabUpperCase');
    });

    it('should convert PascalCase to pascalCase', function ()
    {
        const namingConvention = new CamelCaseNamingConvention();
        
        expect(namingConvention.convert('PascalCase')).toBe('pascalCase');
    });
});

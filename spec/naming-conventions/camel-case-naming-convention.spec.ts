import { CamelCaseNamingConvention } from '../../src/naming-conventions';

describe('Camel case naming convention', () => 
{
    it('should convert camelCase to camelCase', () =>
    {
        const namingConvention = new CamelCaseNamingConvention();

        expect(namingConvention.convert('camelCase')).toBe('camelCase');
    });

    it('should convert snake_case to snakeCase', () =>
    {
        const namingConvention = new CamelCaseNamingConvention();

        expect(namingConvention.convert('snake_case')).toBe('snakeCase');
    });

    it('should convert SNAKE_UPPER_CASE to snakeUpperCase', () =>
    {
        const namingConvention = new CamelCaseNamingConvention();

        expect(namingConvention.convert('SNAKE_UPPER_CASE')).toBe('snakeUpperCase');
    });

    it('should convert kebab-case to kebabCase', () =>
    {
        const namingConvention = new CamelCaseNamingConvention();
        
        expect(namingConvention.convert('kebab-case')).toBe('kebabCase');
    });

    it('should convert KEBAB-UPPER-CASE to kebabUpperCase', () =>
    {
        const namingConvention = new CamelCaseNamingConvention();
        
        expect(namingConvention.convert('KEBAB-UPPER-CASE')).toBe('kebabUpperCase');
    });

    it('should convert PascalCase to pascalCase', () =>
    {
        const namingConvention = new CamelCaseNamingConvention();
        
        expect(namingConvention.convert('PascalCase')).toBe('pascalCase');
    });
});

import { KebabCaseNamingConvention } from '../../src';

describe('Kebab case naming convention', () =>
{
    it('should convert camelCase to camel-case', () =>
    {
        const namingConvention = new KebabCaseNamingConvention();

        expect(namingConvention.convert('camelCase')).toBe('camel-case');
    });

    it('should convert snake_case to snake-case', () =>
    {
        const namingConvention = new KebabCaseNamingConvention();

        expect(namingConvention.convert('snake_case')).toBe('snake-case');
    });

    it('should convert SNAKE_UPPER_CASE to snake-upper-case', () =>
    {
        const namingConvention = new KebabCaseNamingConvention();

        expect(namingConvention.convert('SNAKE_UPPER_CASE')).toBe('snake-upper-case');
    });

    it('should convert kebab-case to kebab-case', () =>
    {
        const namingConvention = new KebabCaseNamingConvention();
        
        expect(namingConvention.convert('kebab-case')).toBe('kebab-case');
    });

    it('should convert KEBAB-UPPER-CASE to kebab-upper-case', () =>
    {
        const namingConvention = new KebabCaseNamingConvention();
        
        expect(namingConvention.convert('KEBAB-UPPER-CASE')).toBe('kebab-upper-case');
    });

    it('should convert PascalCase to pascal-case', () =>
    {
        const namingConvention = new KebabCaseNamingConvention();
        
        expect(namingConvention.convert('PascalCase')).toBe('pascal-case');
    });
});

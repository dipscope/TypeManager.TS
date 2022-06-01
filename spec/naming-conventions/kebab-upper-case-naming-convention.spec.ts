import { KebabUpperCaseNamingConvention } from '../../src';

describe('Kebab upper case naming convention', () =>
{
    it('should convert camelCase to CAMEL-CASE', () =>
    {
        const namingConvention = new KebabUpperCaseNamingConvention();

        expect(namingConvention.convert('camelCase')).toBe('CAMEL-CASE');
    });

    it('should convert snake_case to SNAKE-CASE', () =>
    {
        const namingConvention = new KebabUpperCaseNamingConvention();

        expect(namingConvention.convert('snake_case')).toBe('SNAKE-CASE');
    });

    it('should convert SNAKE_UPPER_CASE to SNAKE-UPPER-CASE', () =>
    {
        const namingConvention = new KebabUpperCaseNamingConvention();

        expect(namingConvention.convert('SNAKE_UPPER_CASE')).toBe('SNAKE-UPPER-CASE');
    });

    it('should convert kebab-case to KEBAB-CASE', () =>
    {
        const namingConvention = new KebabUpperCaseNamingConvention();
        
        expect(namingConvention.convert('kebab-case')).toBe('KEBAB-CASE');
    });

    it('should convert KEBAB-UPPER-CASE to KEBAB-UPPER-CASE', () =>
    {
        const namingConvention = new KebabUpperCaseNamingConvention();
        
        expect(namingConvention.convert('KEBAB-UPPER-CASE')).toBe('KEBAB-UPPER-CASE');
    });

    it('should convert PascalCase to PASCAL-CASE', () =>
    {
        const namingConvention = new KebabUpperCaseNamingConvention();
        
        expect(namingConvention.convert('PascalCase')).toBe('PASCAL-CASE');
    });
});

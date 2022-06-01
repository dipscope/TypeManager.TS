import { SnakeUpperCaseNamingConvention } from '../../src';

describe('Snake upper case naming convention', () =>
{
    it('should convert camelCase to CAMEL_CASE', () =>
    {
        const namingConvention = new SnakeUpperCaseNamingConvention();

        expect(namingConvention.convert('camelCase')).toBe('CAMEL_CASE');
    });

    it('should convert snake_case to SNAKE_CASE', () =>
    {
        const namingConvention = new SnakeUpperCaseNamingConvention();

        expect(namingConvention.convert('snake_case')).toBe('SNAKE_CASE');
    });

    it('should convert SNAKE_UPPER_CASE to SNAKE_UPPER_CASE', () =>
    {
        const namingConvention = new SnakeUpperCaseNamingConvention();

        expect(namingConvention.convert('SNAKE_UPPER_CASE')).toBe('SNAKE_UPPER_CASE');
    });

    it('should convert kebab-case to KEBAB_CASE', () =>
    {
        const namingConvention = new SnakeUpperCaseNamingConvention();
        
        expect(namingConvention.convert('kebab-case')).toBe('KEBAB_CASE');
    });

    it('should convert KEBAB-UPPER-CASE to KEBAB_UPPER_CASE', () =>
    {
        const namingConvention = new SnakeUpperCaseNamingConvention();
        
        expect(namingConvention.convert('KEBAB-UPPER-CASE')).toBe('KEBAB_UPPER_CASE');
    });

    it('should convert PascalCase to PASCAL_CASE', () =>
    {
        const namingConvention = new SnakeUpperCaseNamingConvention();
        
        expect(namingConvention.convert('PascalCase')).toBe('PASCAL_CASE');
    });
});

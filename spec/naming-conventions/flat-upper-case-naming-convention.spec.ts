import { FlatUpperCaseNamingConvention } from '../../src';

describe('Flat upper case naming convention', () =>
{
    it('should convert camelCase to CAMELCASE', () =>
    {
        const namingConvention = new FlatUpperCaseNamingConvention();

        expect(namingConvention.convert('camelCase')).toBe('CAMELCASE');
    });

    it('should convert snake_case to SNAKECASE', () =>
    {
        const namingConvention = new FlatUpperCaseNamingConvention();

        expect(namingConvention.convert('snake_case')).toBe('SNAKECASE');
    });

    it('should convert SNAKE_UPPER_CASE to SNAKEUPPERCASE', () =>
    {
        const namingConvention = new FlatUpperCaseNamingConvention();

        expect(namingConvention.convert('SNAKE_UPPER_CASE')).toBe('SNAKEUPPERCASE');
    });

    it('should convert kebab-case to KEBABCASE', () =>
    {
        const namingConvention = new FlatUpperCaseNamingConvention();
        
        expect(namingConvention.convert('kebab-case')).toBe('KEBABCASE');
    });

    it('should convert KEBAB-UPPER-CASE to KEBABUPPERCASE', () =>
    {
        const namingConvention = new FlatUpperCaseNamingConvention();
        
        expect(namingConvention.convert('KEBAB-UPPER-CASE')).toBe('KEBABUPPERCASE');
    });

    it('should convert PascalCase to PASCALCASE', () =>
    {
        const namingConvention = new FlatUpperCaseNamingConvention();
        
        expect(namingConvention.convert('PascalCase')).toBe('PASCALCASE');
    });
});

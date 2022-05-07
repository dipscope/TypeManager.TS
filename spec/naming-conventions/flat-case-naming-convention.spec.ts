import { FlatCaseNamingConvention } from '../../src/naming-conventions';

describe('Flat case naming convention', () =>
{
    it('should convert camelCase to camelcase', () =>
    {
        const namingConvention = new FlatCaseNamingConvention();

        expect(namingConvention.convert('camelCase')).toBe('camelcase');
    });

    it('should convert snake_case to snakecase', () =>
    {
        const namingConvention = new FlatCaseNamingConvention();

        expect(namingConvention.convert('snake_case')).toBe('snakecase');
    });

    it('should convert SNAKE_UPPER_CASE to snakeuppercase', () =>
    {
        const namingConvention = new FlatCaseNamingConvention();

        expect(namingConvention.convert('SNAKE_UPPER_CASE')).toBe('snakeuppercase');
    });

    it('should convert kebab-case to kebabcase', () =>
    {
        const namingConvention = new FlatCaseNamingConvention();
        
        expect(namingConvention.convert('kebab-case')).toBe('kebabcase');
    });

    it('should convert KEBAB-UPPER-CASE to kebabuppercase', () =>
    {
        const namingConvention = new FlatCaseNamingConvention();
        
        expect(namingConvention.convert('KEBAB-UPPER-CASE')).toBe('kebabuppercase');
    });

    it('should convert PascalCase to pascalcase', () =>
    {
        const namingConvention = new FlatCaseNamingConvention();
        
        expect(namingConvention.convert('PascalCase')).toBe('pascalcase');
    });
});

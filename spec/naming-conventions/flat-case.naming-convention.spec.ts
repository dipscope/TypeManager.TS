import { FlatCaseNamingConvention } from './../../src/naming-conventions';

describe('Flat case naming convention', function () 
{
    it('should convert camelCase to camelcase', function ()
    {
        const namingConvention = new FlatCaseNamingConvention();

        expect(namingConvention.convert('camelCase')).toBe('camelcase');
    });

    it('should convert snake_case to snakecase', function ()
    {
        const namingConvention = new FlatCaseNamingConvention();

        expect(namingConvention.convert('snake_case')).toBe('snakecase');
    });

    it('should convert SNAKE_UPPER_CASE to snakeuppercase', function ()
    {
        const namingConvention = new FlatCaseNamingConvention();

        expect(namingConvention.convert('SNAKE_UPPER_CASE')).toBe('snakeuppercase');
    });

    it('should convert kebab-case to kebabcase', function ()
    {
        const namingConvention = new FlatCaseNamingConvention();
        
        expect(namingConvention.convert('kebab-case')).toBe('kebabcase');
    });

    it('should convert KEBAB-UPPER-CASE to kebabuppercase', function ()
    {
        const namingConvention = new FlatCaseNamingConvention();
        
        expect(namingConvention.convert('KEBAB-UPPER-CASE')).toBe('kebabuppercase');
    });

    it('should convert PascalCase to pascalcase', function ()
    {
        const namingConvention = new FlatCaseNamingConvention();
        
        expect(namingConvention.convert('PascalCase')).toBe('pascalcase');
    });
});

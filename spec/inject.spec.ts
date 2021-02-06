import { Inject, TypeArtisan } from './../src';

class X
{
    public constructor(
        @Inject('a') public a: string, 
        @Inject(String) public b: string,
        @Inject({ typeCtor: String, key: 'c' }) public c: string
    )
    {
        return;
    }
}

describe('Inject decorator', function () 
{
    it('should register type metadata', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        expect(typeMetadata).toBeDefined();
    });

    it('should register inject metadata', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);

        const aInjectMetadata = typeMetadata.injectMetadataMap.get(0);
        const bInjectMetadata = typeMetadata.injectMetadataMap.get(1);
        const cInjectMetadata = typeMetadata.injectMetadataMap.get(2);

        expect(aInjectMetadata).toBeDefined();
        expect(aInjectMetadata?.index).toBe(0);
        expect(aInjectMetadata?.injectOptions.key).toBe('a');
        expect(aInjectMetadata?.injectOptions.typeCtor).toBeUndefined();

        expect(bInjectMetadata).toBeDefined();
        expect(bInjectMetadata?.index).toBe(1);
        expect(bInjectMetadata?.injectOptions.key).toBeUndefined();
        expect(bInjectMetadata?.injectOptions.typeCtor).toBeDefined();

        expect(cInjectMetadata).toBeDefined();
        expect(cInjectMetadata?.index).toBe(2);
        expect(cInjectMetadata?.injectOptions.key).toBe('c');
        expect(cInjectMetadata?.injectOptions.typeCtor).toBeDefined();
    });
});

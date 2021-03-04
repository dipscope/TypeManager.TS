import { Inject, TypeArtisan } from '../src';

class User
{
    public constructor(
        @Inject('name') public name: string, 
        @Inject(String) public email: string,
        @Inject({ typeCtor: String, key: 'group' }) public group: string
    )
    {
        return;
    }
}

describe('Inject decorator', () =>
{
    it('should register type metadata', () =>
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata).toBeDefined();
    });

    it('should register inject metadata', () =>
    {
        const userMetadata      = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata  = userMetadata.injectMetadataMap.get(0);
        const userEmailMetadata = userMetadata.injectMetadataMap.get(1);
        const userGroupMetadata = userMetadata.injectMetadataMap.get(2);

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.index).toBe(0);
        expect(userNameMetadata?.injectOptions.key).toBe('name');
        expect(userNameMetadata?.injectOptions.typeCtor).toBeUndefined();

        expect(userEmailMetadata).toBeDefined();
        expect(userEmailMetadata?.index).toBe(1);
        expect(userEmailMetadata?.injectOptions.key).toBeUndefined();
        expect(userEmailMetadata?.injectOptions.typeCtor).toBeDefined();

        expect(userGroupMetadata).toBeDefined();
        expect(userGroupMetadata?.index).toBe(2);
        expect(userGroupMetadata?.injectOptions.key).toBe('group');
        expect(userGroupMetadata?.injectOptions.typeCtor).toBeDefined();
    });
});

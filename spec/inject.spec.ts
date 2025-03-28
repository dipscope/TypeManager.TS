import { Inject, TypeManager } from '../src';

class User
{
    public constructor(
        @Inject('name') public name: string, 
        @Inject(String) public email: string,
        @Inject({ typeArgument: String, key: 'group' }) public group: string
    )
    {
        return;
    }
}

describe('Inject decorator', () =>
{
    it('should register type metadata', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);

        expect(userMetadata).toBeDefined();
    });

    it('should register inject metadata', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.injectMetadataMap.get(0);
        const userEmailMetadata = userMetadata.injectMetadataMap.get(1);
        const userGroupMetadata = userMetadata.injectMetadataMap.get(2);

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.injectIndex).toBe(0);
        expect(userNameMetadata?.key).toBe('name');
        expect(userNameMetadata?.typeArgument).toBeUndefined();

        expect(userEmailMetadata).toBeDefined();
        expect(userEmailMetadata?.injectIndex).toBe(1);
        expect(userEmailMetadata?.key).toBeUndefined();
        expect(userEmailMetadata?.typeArgument).toBeDefined();

        expect(userGroupMetadata).toBeDefined();
        expect(userGroupMetadata?.injectIndex).toBe(2);
        expect(userGroupMetadata?.key).toBe('group');
        expect(userGroupMetadata?.typeArgument).toBeDefined();
    });
});

import { Type, TypeArtisan, Property } from './../../src';
import { Multiple } from './../../src/helpers';

@Type()
class User
{
    @Property() @Multiple(false) public name?: string;
    @Property() @Multiple() public groups?: string[];
}

describe('Multiple decorator', function () 
{
    it('should register property as multiple', function ()
    {
        const userMetadata       = TypeArtisan.extractTypeMetadata(User);
        const userNameMetadata   = userMetadata.propertyMetadataMap.get('name');
        const userGroupsMetadata = userMetadata.propertyMetadataMap.get('groups');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.multiple).toBeFalse();

        expect(userGroupsMetadata).toBeDefined();
        expect(userGroupsMetadata?.propertyOptions.multiple).toBeTrue();
    });
});

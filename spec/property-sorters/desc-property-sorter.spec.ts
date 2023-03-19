import { DescPropertySorter, Inject, Property, Type, TypeManager } from '../../src';

@Type({
    propertySorter: new DescPropertySorter()
})
class User
{
    @Property(String) public title: string;
    @Property(String) public name: string;
    @Property(String) public status: string;
    
    public constructor(
        @Inject('name') name: string, 
        @Inject('status') status: string,
        @Inject('title') title: string
    )
    {
        this.name = name;
        this.status = status;
        this.title = title;

        return;
    }
}

describe('Desc property sorter', () =>
{
    it('should sort properties in descending order', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        const namePropertyMetadata = userMetadata.propertyMetadataMap.get('name');
        const statusPropertyMetadata = userMetadata.propertyMetadataMap.get('status');
        const titlePropertyMetadata = userMetadata.propertyMetadataMap.get('title');
        const sortedPropertyMetadatas = Array.from(userMetadata.sortedPropertyMetadatas);

        expect(userMetadata.propertySorter).toBeInstanceOf(DescPropertySorter);
        expect(namePropertyMetadata).toBe(sortedPropertyMetadatas[2]);
        expect(statusPropertyMetadata).toBe(sortedPropertyMetadatas[1]);
        expect(titlePropertyMetadata).toBe(sortedPropertyMetadatas[0]);
    });
});

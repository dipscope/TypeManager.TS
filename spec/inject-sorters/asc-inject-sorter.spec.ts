import { AscInjectSorter, Inject, Property, Type, TypeManager } from '../../src';

@Type({
    injectSorter: new AscInjectSorter()
})
class User
{
    @Property(String) public name: string;
    @Property(String) public status: string;
    @Property(String) public title: string;

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

describe('Asc inject sorter', () =>
{
    it('should sort injects in ascending order', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        const nameInjectMetadata = userMetadata.injectMetadataMap.get(0);
        const statusInjectMetadata = userMetadata.injectMetadataMap.get(1);
        const titleInjectMetadata = userMetadata.injectMetadataMap.get(2);
        const sortedInjectMetadatas = Array.from(userMetadata.sortedInjectMetadatas);

        expect(userMetadata.injectSorter).toBeInstanceOf(AscInjectSorter);
        expect(nameInjectMetadata).toBe(sortedInjectMetadatas[0]);
        expect(statusInjectMetadata).toBe(sortedInjectMetadatas[1]);
        expect(titleInjectMetadata).toBe(sortedInjectMetadatas[2]);
    });
});

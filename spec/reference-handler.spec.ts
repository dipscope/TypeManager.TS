import { Property, ReferenceHandler, Type, TypeManager } from '../src';
import { PathReferenceHandler } from '../src/reference-handlers';

@Type()
@ReferenceHandler(new PathReferenceHandler())
class User
{
    @Property() @ReferenceHandler(new PathReferenceHandler()) public name?: string;
}

describe('Reference handler decorator', () =>
{
    it('should register custom reference handler for a type', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.referenceHandler).toBeInstanceOf(PathReferenceHandler);
    });

    it('should register custom reference handler for a property', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);
        const userNameMetadata = userMetadata.propertyMetadataMap.get('name');

        expect(userNameMetadata).toBeDefined();
        expect(userNameMetadata?.propertyOptions.referenceHandler).toBeInstanceOf(PathReferenceHandler);
    });
});

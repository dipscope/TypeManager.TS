import { Factory, Property, Type, TypeArtisan } from '../src';
import { TypeFactory } from '../src/factories';

@Type()
@Factory(new TypeFactory())
class User
{
    @Property() public name?: string;
}

describe('Type factory decorator', () =>
{
    it('should register custom factory for a type', () =>
    {
        const userMetadata = TypeArtisan.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.factory).toBeInstanceOf(TypeFactory);
    });
});

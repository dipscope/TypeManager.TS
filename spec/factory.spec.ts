import { Factory, Property, Type, TypeManager } from '../src';
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
        const userMetadata = TypeManager.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.factory).toBeInstanceOf(TypeFactory);
    });
});

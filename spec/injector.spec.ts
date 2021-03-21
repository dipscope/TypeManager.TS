import { Injector, Property, Type, TypeManager } from '../src';
import { SingletonInjector } from '../src/injectors';

@Type()
@Injector(new SingletonInjector())
class User
{
    @Property() public name?: string;
}

describe('Type injector decorator', () =>
{
    it('should register custom injector for a type', () =>
    {
        const userMetadata = TypeManager.extractTypeMetadata(User);

        expect(userMetadata.typeOptions.injector).toBeInstanceOf(SingletonInjector);
    });
});

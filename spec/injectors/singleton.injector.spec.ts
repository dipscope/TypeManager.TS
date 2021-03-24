import { Inject, Injectable, TypeManager } from '../../src';
import { SingletonInjector } from '../../src/injectors';

@Injectable()
class MessageService 
{
    public property?: string;
}

@Injectable()
class UserService 
{
    public property?: string;

    public constructor(@Inject(MessageService) public messageService: MessageService)
    {
        return;
    }
}

describe('Singleton injector', () =>
{
    it('should inject and return the same instances of type', () =>
    {
        const singletonInjector      = new SingletonInjector();
        const messageServiceMetadata = TypeManager.extractTypeMetadata(MessageService);
        const userServiceMetadata    = TypeManager.extractTypeMetadata(UserService);
        const userService            = singletonInjector.get(userServiceMetadata);
        const messageService         = singletonInjector.get(messageServiceMetadata);

        expect(userService).toBeInstanceOf(UserService);
        expect(messageService).toBeInstanceOf(MessageService);
        expect(userService?.messageService).toBe(messageService);
    });
});

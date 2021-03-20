import { Injector } from './core/injector';
import { Type } from './type';

/**
 * Injector decorator.
 * 
 * Used to define custom injector for a type.
 * 
 * @param {Injector} injector Injector.
 * 
 * @returns {ClassDecorator} Class decorator.
 */
export function Injector(injector: Injector): ClassDecorator
{
    return Type({ injector: injector });
}

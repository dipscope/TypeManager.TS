import { Fn } from './core/fn';
import { Injector } from './core/injector';
import { TypeAndProperty } from './type-and-property';

/**
 * Injector decorator.
 * 
 * Used to define custom injector for type and property.
 * 
 * @param {Injector} injector Injector.
 * 
 * @returns {ClassDecorator&PropertyDecorator} Class and property decorator.
 */
export function Injector(injector: Injector): ClassDecorator & PropertyDecorator
{
    return TypeAndProperty({ injector: injector });
}

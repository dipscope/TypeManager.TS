import { Type } from './../type';

/**
 * Injectable decorator.
 * 
 * Can be used on type to declare it as injectable.
 * 
 * @param {boolean} injectable Injectable?
 * 
 * @returns {ClassDecorator} Class decorator.
 */
export function Injectable(injectable?: boolean): ClassDecorator
{
    return Type({ injectable: injectable ?? true });
}

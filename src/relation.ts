import { EntityBuilder } from './entity.builder';
import { RelationDescriptor } from './relation.descriptor';

/**
 * Relation property decorator.
 *
 * Used to define that certain entity property is a relation to another entity.
 * Entity relation can be a constructor or entity name defined by developer.
 *
 * @param {string|Function} relationEntity Relation entity constructor or unique name.
 * @param {string} propertyAlias Alias for a property.
 *
 * @returns {Function} Decorator function.
 */
export function Relation(relationEntity: string | Function, propertyAlias?: string): Function
{
    return function (target: any, propertyName: string): void
    {
        const relationDescriptor = new RelationDescriptor(target.constructor, propertyName);

        if (typeof relationEntity === typeof 'string') 
        {
            relationDescriptor.relationEntityName = relationEntity as string;
        }
        else 
        {
            relationDescriptor.relationEntityCtor = relationEntity as new () => any;
        }

        relationDescriptor.propertyAlias = propertyAlias;

        EntityBuilder.registerPropertyDescriptor(relationDescriptor);

        return;
    }
}

/**
 * Alias for relation decorator.
 *
 * @param {string|Function} relationEntity Relation entity constructor or unique name.
 * @param {string} propertyAlias Alias for a property.
 *
 * @returns {Function} Decorator function.
 */
export function Rel(relationEntity: string | Function, propertyAlias?: string): Function
{
    return Relation(relationEntity, propertyAlias);
}

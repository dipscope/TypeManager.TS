import { EntityBuilder } from './entity.builder';
import { EntityDescriptor } from './entity.descriptor';

/**
 * Entity decorator.
 *
 * Registers entity class in the entity builder. Entity name is
 * unique name for that class.
 * 
 * @param {string} entityName Unique name for entity.
 *
 * @returns {Function} Decorator function.
 */
export function Entity(entityName?: string): Function
{
    return function (entityCtor: new () => any): Function
    {
        const entityDescriptor = new EntityDescriptor(entityCtor);

        entityDescriptor.entityName = entityName;

        EntityBuilder.registerEntityDescriptor(entityDescriptor);

        return entityCtor;
    }
}

/**
 * Alias for entity decorator.
 * 
 * @param {string} modelName Unique name for model.
 * 
 * @returns {Function} Decorator function.
 */
export function Model(modelName?: string): Function
{
    return Entity(modelName);
}

/**
 * Alias for entity decorator.
 *
 * @param {string} typeName Unique name for type.
 *
 * @returns {Function} Decorator function.
 */
export function Type(typeName?: string): Function
{
    return Entity(typeName);
}

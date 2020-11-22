import { EntityBuilder } from './entity.builder';

/**
 * Converts JSON string to entity.
 * 
 * @param {Function} entityCtor Entity constructor.
 * @param {string|object|object[]} json JSON string, object or array of objects.
 * 
 * @returns {any} Entity.
 */
export function jsonToEntity(entityCtor: new () => any, json: string | object | object[]): any
{
    return EntityBuilder.buildEntity(entityCtor, json);
}

/**
 * Converts entity to JSON string.
 * 
 * @param {Function} entityCtor Entity constructor.
 * @param {any} entity Entity.
 * 
 * @returns {string} JSON string.
 */
export function entityToJson(entityCtor: new () => any, entity: any): string
{
    return EntityBuilder.buildJson(entityCtor, entity);
}

/**
 * Converts object to entity.
 * 
 * @param {Function} entityCtor Entity constructor.
 * @param {string|object|object[]} object JSON string, object or array of objects.
 * 
 * @returns {any} Entity.
 */
export function objectToEntity(entityCtor: new () => any, object: string | object | object[]): any
{
    return EntityBuilder.buildEntity(entityCtor, object);
}

/**
 * Converts entity to object.
 * 
 * @param {Function} entityCtor Entity constructor.
 * @param {any} entity Entity.
 * 
 * @returns {object} Entity object.
 */
export function entityToObject(entityCtor: new () => any, entity: any): object
{
    return EntityBuilder.buildObject(entityCtor, entity);
}

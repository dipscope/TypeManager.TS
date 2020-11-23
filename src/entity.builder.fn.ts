import { EntityBuilder } from './entity.builder';

/**
 * Converts JSON string to entity.
 * 
 * @param {Function} entityCtor Entity constructor.
 * @param {string|any|any[]} json JSON string, object or array of objects.
 * 
 * @returns {any|null} Entity.
 */
export function jsonToEntity(entityCtor: new () => any, json: string | any | any[]): any | null
{
    return EntityBuilder.buildEntity(entityCtor, json);
}

/**
 * Converts entity to JSON string.
 * 
 * @param {Function} entityCtor Entity constructor.
 * @param {any|any[]} entity Entity or array of entities.
 * 
 * @returns {string|null} JSON string or null.
 */
export function entityToJson(entityCtor: new () => any, entity: any | any[]): string | null
{
    return EntityBuilder.buildJson(entityCtor, entity);
}

/**
 * Converts object to entity.
 * 
 * @param {Function} entityCtor Entity constructor.
 * @param {string|any|any[]} object JSON string, object or array of objects.
 * 
 * @returns {any|null} Entity or null.
 */
export function objectToEntity(entityCtor: new () => any, object: string | any | any[]): any | null
{
    return EntityBuilder.buildEntity(entityCtor, object);
}

/**
 * Converts entity to object.
 * 
 * @param {Function} entityCtor Entity constructor.
 * @param {any|any[]} entity Entity.
 * 
 * @returns {object|null} Entity object.
 */
export function entityToObject(entityCtor: new () => any, entity: any | any[]): object | null
{
    return EntityBuilder.buildObject(entityCtor, entity);
}

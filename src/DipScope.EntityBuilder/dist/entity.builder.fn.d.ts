/**
 * Converts JSON string to entity.
 *
 * @param {Function} entityCtor Entity constructor.
 * @param {string|object|object[]} json JSON string, object or array of objects.
 *
 * @returns {any} Entity.
 */
export declare function jsonToEntity(entityCtor: new () => any, json: string | object | object[]): any;
/**
 * Converts entity to JSON string.
 *
 * @param {Function} entityCtor Entity constructor.
 * @param {any} entity Entity.
 *
 * @returns {string} JSON string.
 */
export declare function entityToJson(entityCtor: new () => any, entity: any): string;
/**
 * Converts object to entity.
 *
 * @param {Function} entityCtor Entity constructor.
 * @param {string|object|object[]} object JSON string, object or array of objects.
 *
 * @returns {any} Entity.
 */
export declare function objectToEntity(entityCtor: new () => any, object: string | object | object[]): any;
/**
 * Converts entity to object.
 *
 * @param {Function} entityCtor Entity constructor.
 * @param {any} entity Entity.
 *
 * @returns {object} Entity object.
 */
export declare function entityToObject(entityCtor: new () => any, entity: any): object;

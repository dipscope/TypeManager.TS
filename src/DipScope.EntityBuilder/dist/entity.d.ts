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
export declare function Entity(entityName?: string): Function;
/**
 * Alias for entity decorator.
 *
 * @param {string} modelName Unique name for model.
 *
 * @returns {Function} Decorator function.
 */
export declare function Model(modelName?: string): Function;
/**
 * Alias for entity decorator.
 *
 * @param {string} typeName Unique name for type.
 *
 * @returns {Function} Decorator function.
 */
export declare function Type(typeName?: string): Function;

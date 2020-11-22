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
export declare function Relation(relationEntity: string | Function, propertyAlias?: string): Function;
/**
 * Alias for relation decorator.
 *
 * @param {string|Function} relationEntity Relation entity constructor or unique name.
 * @param {string} propertyAlias Alias for a property.
 *
 * @returns {Function} Decorator function.
 */
export declare function Rel(relationEntity: string | Function, propertyAlias?: string): Function;

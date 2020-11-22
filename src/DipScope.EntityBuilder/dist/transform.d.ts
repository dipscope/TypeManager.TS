/**
 * Property transform decorator.
 *
 * Used to apply additional property transformation.
 * For example transform date string to date time object and etc.
 *
 * @param {Function} deserializeFn Deserialize function.
 * @param {Function} serializeFn Serialize function.
 *
 * @returns {Function} Decorator function.
 */
export declare function Transform(deserializeFn?: (x: any) => any, serializeFn?: (x: any) => any): Function;
/**
 * Alias for transform decorator.
 *
 * @param {Function} deserializeFn Deserialize function.
 * @param {Function} serializeFn Serialize function.
 *
 * @returns {Function}  Decorator function.
 */
export declare function Convert(deserializeFn?: (x: any) => any, serializeFn?: (x: any) => any): Function;

/**
 * Resolver used to get custom value if it is not defined.
 * 
 * @type {CustomValueResolver<TCustomValue>}
 */
export type CustomValueResolver<TCustomValue> = () => TCustomValue;

import { Nullable } from './nullable';

/**
 * Resolver used to get null value. If null values are not preserved it will 
 * fallback to the default values if they are enabled.
 * 
 * @type {NullValueResolver}
 */
export type NullValueResolver = () => Nullable<any>;

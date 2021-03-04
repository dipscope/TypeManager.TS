import { ReferenceValue } from './reference-value';

/**
 * Reference resolver which can be returned by reference handler to get a reference value
 * at a later time due to circular dependency.
 * 
 * @type {ReferenceValueResolver}
 */
export type ReferenceValueResolver = () => ReferenceValue;

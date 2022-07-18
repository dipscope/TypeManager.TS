import { ReferenceValue } from './reference-value';

/**
 * Callback to get a reference value when one is not yet present for a reference key.
 * 
 * @type {ReferenceValueGetter}
 */
export type ReferenceValueGetter = () => ReferenceValue;

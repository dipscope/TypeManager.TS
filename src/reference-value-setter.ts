import { ReferenceValue } from './reference-value';

/**
 * Callback to set a reference value when one may be resolved for a reference key.
 * 
 * @type {ReferenceValueSetter}
 */
export type ReferenceValueSetter = (referenceValue: ReferenceValue, jsonPathKey: any) => void;

import { ReferenceValue } from './reference-value';

/**
 * Function to initialize a reference value when one is not yet present 
 * for a reference key.
 * 
 * @type {ReferenceValueInitializer}
 */
export type ReferenceValueInitializer = () => ReferenceValue;

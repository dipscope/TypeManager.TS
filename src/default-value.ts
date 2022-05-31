import { DefaultValueResolver } from './default-value-resolver';

/**
 * Default value which can be defined by developer.
 * 
 * @type {DefaultValue}
 */
export type DefaultValue = any | DefaultValueResolver;

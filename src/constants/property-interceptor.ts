import { PropertyInterceptor } from '../property-interceptor';

/**
 * Represents a default property interceptor.
 * 
 * @type {PropertyInterceptor<any, any>}
 */
export const PROPERTY_INTERCEPTOR: PropertyInterceptor<any, any> = (propertyValue: any) => propertyValue;

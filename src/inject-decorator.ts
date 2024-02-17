/**
 * Inject decorator.
 * 
 * @type {InjectDecorator}
 */
export type InjectDecorator = (target: any, propertyName: string | symbol | undefined, injectIndex: number) => void;

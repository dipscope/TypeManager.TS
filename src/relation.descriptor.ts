import { PropertyDescriptor } from './property.descriptor';

/**
 * Relation descriptor contains information about relationship between different entities.
 *
 * @type {RelationDescriptor}
 */
export class RelationDescriptor extends PropertyDescriptor
{
    /**
     * Relation entity constructor defined by developer.
     *
     * @type {Function}
     */
    public relationEntityCtor?: new () => any;

    /**
     * Relation entity name defined by developer.
     *
     * @type {string}
     */
    public relationEntityName?: string;
}

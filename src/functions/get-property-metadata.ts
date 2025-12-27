import { Optional } from '../optional';
import { PropertyMetadata } from '../property-metadata';
import { TypeFn } from '../type-fn';
import { TYPE_MANAGER_STATE } from '../type-manager-state';
import { TypeMetadata } from '../type-metadata';

/**
 * Gets property metadata directly from type function by property name. This
 * function works in active context. So the active type manager config is used
 * to resolve property metadata.
 * 
 * @param {TypeFn<TDeclaringObject>} typeFn Type function of property declaring object.
 * @param {string} propertyName Property name to get.
 * 
 * @returns {Optional<PropertyMetadata<TDeclaringObject, TObject>>} Property metadata or undefined.
 */
export function getPropertyMetadata<TDeclaringObject, TObject>(
    typeFn: TypeFn<TDeclaringObject>, 
    propertyName: string
): Optional<PropertyMetadata<TDeclaringObject, TObject>>
{
    const prototype = typeFn.prototype;
    const activeSymbol = TYPE_MANAGER_STATE.activeSymbol;
    const staticSymbol = TYPE_MANAGER_STATE.staticSymbol;
    const typeMetadata = (prototype[activeSymbol] ?? prototype[staticSymbol]) as TypeMetadata<TDeclaringObject>;
    
    if (typeMetadata === undefined)
    {
        return undefined;
    }

    const propertyMetadataMap = typeMetadata.typeState.propertyMetadataMap;
    const propertyMetadata = propertyMetadataMap.get(propertyName);

    return propertyMetadata;
}

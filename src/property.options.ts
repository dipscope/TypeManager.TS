import { Serializer } from './serializer';
import { TypeResolver } from './type.resolver';

export interface PropertyOptions
{
    typeResolver?: TypeResolver;
    alias?: string;
    serializable?: boolean;
    deserializable?: boolean;
    serializer?: Serializer<any, any>;
    emitDefaultValue?: boolean;
    reflectMetadata?: boolean;
}

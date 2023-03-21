/**
 * In type script there is no explicit class for unknown type. We want to allow serialization and 
 * deserialization without specify any serializers. However such behaviour should be visible in the 
 * type metadata.
 * 
 * @type {Unknown}
 */
export class Unknown
{
    
}

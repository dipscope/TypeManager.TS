import { Fn } from '../core/fn';
import { ReferenceHandler } from '../core/reference-handler';
import { ReferenceKey } from '../core/reference-key';
import { ReferenceValue } from '../core/reference-value';
import { ReferenceValueInitializer } from '../core/reference-value-initializer';
import { ReferenceValueResolver } from '../core/reference-value-resolver';
import { SerializerContext } from '../core/serializer-context';

/**
 * Path reference handler preserves references using JSONPath.
 * 
 * @type {PathReferenceHandler}
 */
export class PathReferenceHandler implements ReferenceHandler
{
    /**
     * Regular expression used to get array key from a certain place of the JSONPath.
     * 
     * @type {RegExp}
     */
    private readonly arrayKeyRegExp: RegExp = new RegExp('\\[\\\'?([^\\\'\\[\\]]+)\\\'?\\]', 'g');

    /**
     * Defines reference. Called during serialization.
     * 
     * @param {SerializerContext<any>} serializerContext Serializer context.
     * @param {ReferenceKey} referenceKey Reference which acts as a key. This is basically a serializing object.
     * @param {ReferenceValueInitializer} referenceValueInitializer Function to initialize a reference value when one is not yet present for a key.
     * 
     * @returns {ReferenceValue|ReferenceValueResolver} Resolved reference value or reference resolver when circular dependency is detected.
     */
    public define(serializerContext: SerializerContext<any>, referenceKey: ReferenceKey, referenceValueInitializer: ReferenceValueInitializer): ReferenceValue | ReferenceValueResolver
    {
        const referenceMap = serializerContext.referenceMap;
        const referencePath = referenceMap.get(referenceKey);

        if (Fn.isNil(referencePath))
        {
            referenceMap.set(referenceKey, serializerContext.path);

            const value = referenceValueInitializer();

            serializerContext.resolveReferenceCallbacks(referenceKey);

            return value;
        }

        return { $ref: referencePath };
    }

    /**
     * Restores reference. Called during deserialization.
     * 
     * @param {SerializerContext<any>} serializerContext Serializer context.
     * @param {ReferenceKey} referenceKey Reference which acts as a key. This is basically a deserializing object.
     * @param {ReferenceValueInitializer} referenceValueInitializer Function to initialize a reference value when one is not yet present for a key.
     * 
     * @returns {ReferenceValue|ReferenceValueResolver} Resolved reference value or reference resolver when circular dependency is detected.
     */
    public restore(serializerContext: SerializerContext<any>, referenceKey: ReferenceKey, referenceValueInitializer: ReferenceValueInitializer): ReferenceValue | ReferenceValueResolver
    {
        const referenceMap = serializerContext.referenceMap;
        const referenceTarget = this.defineReferenceTarget(serializerContext, referenceKey);
        const referenceValue = referenceMap.get(referenceTarget);

        if (Fn.isNil(referenceValue))
        {
            referenceMap.set(referenceTarget, referenceTarget);

            const value = referenceValueInitializer();

            referenceMap.set(referenceTarget, value);

            serializerContext.resolveReferenceCallbacks(referenceTarget);

            return value;
        }
        
        if (referenceTarget !== referenceKey) 
        {
            serializerContext.pushReferenceCallback(referenceTarget, () =>
            {
                serializerContext.resolveReferenceCallbacks(referenceKey);
            });
        }

        if (referenceTarget === referenceValue)
        {
             return () => referenceMap.get(referenceTarget);
        }

        return referenceValue;
    }

    /**
     * Defines reference target based on reference key.
     * 
     * @param {SerializerContext<any>} serializerContext Serializer context.
     * @param {ReferenceKey} referenceKey Reference which acts as a key. This is basically a deserializing object.
     * 
     * @returns {ReferenceKey} Reference which acts as a target key in context of JSONPath.
     */
    private defineReferenceTarget(serializerContext: SerializerContext<any>, referenceKey: ReferenceKey): ReferenceKey
    {
        const $ = serializerContext.$;
        const referencePath = referenceKey.$ref;

        if (!Fn.isString(referencePath) || !Fn.isObject($))
        {
            return referenceKey;
        }

        if (referencePath === '$')
        {
            return $;
        }

        const referencePathArray = this.convertReferencePathToArray(referencePath);

        referencePathArray.shift();

        let referenceTarget = $;

        for (let i = 0; i < referencePathArray.length; i++)
        {
            referenceTarget = referenceTarget[referencePathArray[i]];
        }

        return referenceTarget;
    }

    /**
     * Converts reference path to array.
     * 
     * @param {string} referencePath Reference path.
     * 
     * @returns {Array<string>} Array reference path.
     */
    private convertReferencePathToArray(referencePath: string): Array<string> 
    {
        const array = new Array<string>();
        const parts = referencePath.split('.');

        for (const part of parts) 
        {
            const keys = part.split(this.arrayKeyRegExp);

            for (const key of keys)
            {
                if (key.length > 0) 
                {
                    array.push(key);
                }
            }
        }

        return array;
    }
}

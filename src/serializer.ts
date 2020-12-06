/**
 * Serializer interface.
 * 
 * @type {Serializer<TInput, TOutput>}
 */
export interface Serializer<TInput, TOutput>
{
    /**
     * Converts input value to output value.
     * 
     * @param {TInput} input Input value.
     * 
     * @returns {TOutput} Ouput value.
     */
    serialize(input: TInput): TOutput;

    /**
     * Converts output value to input value.
     * 
     * @param {TOutput} output Output value.
     * 
     * @returns {TInput} Input value.
     */
    deserialize(output: TOutput): TInput;
}
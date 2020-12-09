/**
 * Type serializer interface.
 * 
 * @type {TypeSerializer<TInput, TOutput>}
 */
export interface TypeSerializer<TInput, TOutput>
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

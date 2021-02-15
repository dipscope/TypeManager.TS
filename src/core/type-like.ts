/**
 * Type to describe type including array, null and undefined variations of it. Used as a
 * generic type for serializer input and output.
 * 
 * @type {TypeLike<TType>}
 */
export type TypeLike<TType> = TType | TypeLike<TType>[] | null | undefined;

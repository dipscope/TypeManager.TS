/**
 * Type to describe type including null and undefined variations of it. Used as a
 * generic type for serializer input and output.
 * 
 * @type {TypeLike<TObject>}
 */
export type TypeLike<TObject> = TObject | null | undefined;

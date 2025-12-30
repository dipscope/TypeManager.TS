import { Any } from './any';
import { Unknown } from './unknown';

/**
 * Represents a primitive type of their corresponding boxed type.
 * 
 * @type {TypePrimitive<TObject>}
 */
export type TypePrimitive<TObject> = 
    TObject extends String ? string : 
    TObject extends Number ? number : 
    TObject extends Boolean ? boolean :
    TObject extends Any ? any :
    TObject extends Unknown ? unknown :
    TObject;

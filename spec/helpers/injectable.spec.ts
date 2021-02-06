import { TypeArtisan } from '../../src';
import { Injectable } from '../../src/helpers';

@Injectable()
class X
{
    public a?: string;
}

@Injectable(false)
class Y
{
    public a?: string;
}

describe('Injectable decorator', function () 
{
    it('should register a type as injectable', function ()
    {
        const xTypeMetadata = TypeArtisan.extractTypeMetadata(X);
        const yTypeMetadata = TypeArtisan.extractTypeMetadata(Y);

        expect(xTypeMetadata.typeOptions.injectable).toBeTrue();
        expect(yTypeMetadata.typeOptions.injectable).toBeFalse();
    });
});

import { ObjectFactory } from './../src/factories';
import { SingletonInjector } from './../src/injectors';
import { ObjectSerializer } from './../src/serializers';
import { Type, TypeArtisan } from './../src';

@Type({
    alias: 'X:Type',
    customData: { data: 1 },
    defaultValue: () => new X(),
    useDefaultValue: true,
    useImplicitConversion: false,
    injectable: true,
    typeFactory: new ObjectFactory(),
    typeInjector: new SingletonInjector(),
    typeSerializer: new ObjectSerializer()
})
class X
{
    public a?: string;
}

describe('Type decorator', function () 
{
    it('should register type metadata', function ()
    {
        const typeMetadata = TypeArtisan.extractTypeMetadata(X);
        const typeCtor     = TypeArtisan.typeCtorMap.get('X:Type');

        expect(typeMetadata.typeOptions.alias).toBe('X:Type');
        expect(typeMetadata.typeOptions.customData).toBeDefined();
        expect(typeMetadata.typeOptions.customData?.data).toBe(1);
        expect(typeMetadata.typeOptions.defaultValue).toBeDefined();
        expect(typeMetadata.typeOptions.defaultValue()).toBeInstanceOf(X);
        expect(typeMetadata.typeOptions.useDefaultValue).toBeTrue();
        expect(typeMetadata.typeOptions.useImplicitConversion).toBeFalse();
        expect(typeMetadata.typeOptions.injectable).toBeTrue();
        expect(typeMetadata.typeOptions.typeFactory).toBeInstanceOf(ObjectFactory);
        expect(typeMetadata.typeOptions.typeInjector).toBeInstanceOf(SingletonInjector);
        expect(typeMetadata.typeOptions.typeSerializer).toBeInstanceOf(ObjectSerializer);

        expect(typeCtor).toBeDefined();
    });
});

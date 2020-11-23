import { EntityBuilder, Entity, Property } from './../src';

@Entity()
export class X
{
    @Property() public a: string;
}

describe('Entity builder', function () {

    it('add', function () {
        let json = { name: "Garry", email: "Email" };

        let entity = EntityBuilder.buildEntity(X, json)

        expect(entity.name).toBe("Garry");
    });


});
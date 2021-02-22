import { Type, TypeManager, Property } from './../../src';

@Type()
class User
{
    @Property(() => String) public name?: string;
    @Property(() => Company) public company?: Company;
}

@Type()
class Company
{
    @Property(() => User) public creatorUser?: User;
    @Property(() => User) public ownerUser?: User;
}

describe('Object references', function () 
{
    it('should be preserved during serialization and deserialization', function ()
    {
        const companyManager = new TypeManager(Company);
        const company        = new Company();
        const user           = new User();
        
        company.creatorUser = user;
        company.ownerUser   = user;
        
        const managedCompany = companyManager.deserialize(companyManager.serialize(company));

        expect(managedCompany).toBeInstanceOf(Company);
        expect(managedCompany?.creatorUser).toBe(managedCompany?.ownerUser);
    });

    it('should be preserved during circular serialization and deserialization', function ()
    {
        const companyManager = new TypeManager(Company);
        const company        = new Company();
        const user           = new User();
        
        company.ownerUser = user;
        user.company      = company;

        const managedCompany = companyManager.deserialize(companyManager.serialize(company));

        expect(managedCompany).toBeInstanceOf(Company);
        expect(managedCompany?.ownerUser?.company).toBe(managedCompany);
    });
});

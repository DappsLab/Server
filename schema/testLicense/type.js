const {gql} = require('apollo-server-express');


const testLicenseTypeDefs = gql`
    
    type TestLicense{
        id:ID!,
        used:Boolean!,
        testPurchasedContract:TestPurchasedContract,
        testOrder:TestOrder!,
        purchaseDateTime:String!,
        testCompilations:[TestCompiledContract],
    }
`;



module.exports = testLicenseTypeDefs;

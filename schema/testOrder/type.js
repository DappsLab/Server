const {gql} = require('apollo-server-express');


const testOrderTypeDefs = gql`
    
    type TestOrder {
        id: ID!,
        user:User!,
        address:String!,
        testAddress:TestAddress!,
        licenseType(licenseType:LicenseType):String!,
        price:String!,
        orderUsed:Boolean!,
        fee:String!,
        transactionToPublisher:String,
        dateTime:String!,
        transactionHash:String!,
        productType(productType:ProductType):String!,
        smartContract:SmartContract,
        dApp:DApp,
        status:String!,
        createdAt: String!,
        updatedAt: String!,
    }
    
    input TestOrderInput{
        testAddress:ID!,
        productType:ProductType!,
        licenseType:LicenseType!,
        fee:String!,
        smartContract:String,
        dApp:ID,
    }
`;



module.exports = testOrderTypeDefs;

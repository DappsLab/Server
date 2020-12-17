const {gql} = require('apollo-server-express');


const testPurchasedContractTypeDefs = gql`
    
    type TestPurchasedContract {
        id: ID!,
        user:User!,
        smartContract:SmartContract!,
        unlimitedCustomization:Boolean!,
        customizationsLeft:Int!,
        testLicenses:[TestLicense],
        createdAt: String!,
        updatedAt: String!,
    }
    
    input TestPurchasedContractInput{
        smartContractId: String!,
        testOrderId:String!,
    }
    
`;



module.exports = testPurchasedContractTypeDefs;

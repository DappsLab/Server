const {gql} = require('apollo-server-express');


const smartContractTypeDefs = gql`
    
    type Order {
        id: ID!,
        user:User!,
        licenseType(licenseType:LicenseType):String!,
        price:String!,
        orderUsed:Boolean!,
        fee:String!,
        dateTime:String!,
        transactionHash:String!,
        productType(productType:ProductType):String!,
        smartContract:SmartContract,
        status:String!,
        createdAt: String!,
        updatedAt: String!,
    }
    
    input OrderInput{
        productType:ProductType!,
        licenseType:LicenseType!,
        fee:String!,
        smartContract:String!,
    }

    enum ProductType {
        SMARTCONTRACT
        DAPP
    }
    
    enum LicenseType{
        SINGLELICENSE,
        UNLIMITEDLICENSE
    }
`;



module.exports = smartContractTypeDefs;

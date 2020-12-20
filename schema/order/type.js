const {gql} = require('apollo-server-express');


const orderTypeDefs = gql`
    
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
        dApp:DApp,
        status:String!,
        createdAt: String!,
        updatedAt: String!,
    }
    
    input OrderInput{
        productType:ProductType!,
        licenseType:LicenseType!,
        fee:String!,
        smartContract:String,
        dApp:ID,
    }


`;



module.exports = orderTypeDefs;

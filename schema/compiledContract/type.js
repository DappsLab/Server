const {gql} = require('apollo-server-express');


const compiledContractTypeDefs = gql`
    
    type CompiledContract {
        id: ID!,
        compilationName:String!,
        user:User!,
        smartContract:SmartContract!,
        compiledFile:String!,
        purchasedContract:PurchasedContract,
        license:License,
        used:Boolean,
        deployments:[DeployedContract],
        createdAt: String!,
        updatedAt: String!,
    }
    
    input CompiledContractInput{
        compilationName:String!,
        smartContract:ID!,
        purchasedContract:ID,
        license:ID,
    }
    
`;



module.exports = compiledContractTypeDefs;

const {gql} = require('apollo-server-express');


const compiledContractTypeDefs = gql`
    
    type CompiledContract {
        id: ID!,
        user:User!,
        smartContract:SmartContract!,
        abi:String!,
        binary:String!,
        purchasedContract:ID,
        license:ID,
#       deplopments:[DeployedContract],
        createdAt: String!,
        updatedAt: String!,
    }
    
    input CompiledContractInput{
        smartContract:ID!,
        purchasedContract:ID,
        license:ID,
    }
    
`;



module.exports = compiledContractTypeDefs;

const {gql} = require('apollo-server-express');


const deployedContractTypeDefs = gql`
    
    type DeployedContract {
        id: ID!,
        user:User!,
        deplopmentLabel:String!,
        compiledContract:CompiledContract!,
        smartContract:SmartContract!,
        contractAddress:String!,
        transactionAddress:String!,
        balance:String,
        transactions:Int,
        createdAt: String!,
        updatedAt: String!,
    }
    
`;



module.exports = deployedContractTypeDefs;

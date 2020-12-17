const {gql} = require('apollo-server-express');


const testDeployedContractTypeDefs = gql`
    
    type TestDeployedContract {
        id: ID!,
        user:User!,
        deplopmentLabel:String!,
        testCompiledContract:CompiledContract!,
        smartContract:SmartContract!,
        contractAddress:String!,
        transactionAddress:String!,
        balance:String,
        transactions:Int,
        createdAt: String!,
        updatedAt: String!,
    }
    
`;



module.exports = testDeployedContractTypeDefs;

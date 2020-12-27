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
    
    input TestDeployedContractInput{
        testCompiledContractId:ID!,
        testAddressId:ID!,
        argumentsArray:[Argument],
        deplopmentLabel:String!,
        fee:String!,
    }
    input Argument{
        dataType:String!,
        data:[String],
    }
    
`;



module.exports = testDeployedContractTypeDefs;

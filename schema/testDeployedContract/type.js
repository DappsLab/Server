const {gql} = require('apollo-server-express');


const testDeployedContractTypeDefs = gql`    
    
    type TestDeployedContract {
        id: ID!,
        user:User!,
        deplopmentLabel:String!,
        testCompiledContract:CompiledContract!,
        smartContract:SmartContract!,
        ownerAddress:String!,
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
        unlimitedCustomization:Boolean!,
        deplopmentLabel:String!,
    }
    input Argument{ 
        index:Int,
        dataType: String!,  
        data: [String],
    }
    
`;



module.exports = testDeployedContractTypeDefs;

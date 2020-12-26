const {gql} = require('apollo-server-express');


const testCompiledContractTypeDefs = gql`
    
    type TestCompiledContract {
        id: ID!,
        compilationName:String!,
        user:User!,
        smartContract:SmartContract!,
        compiledFile:String!,
        testPurchasedContract:TestPurchasedContract,
        testLicense:TestLicense,
        testDeplopments:[TestDeployedContract],
        createdAt: String!,
        updatedAt: String!,
    }
    type TestCompiledContractVersion{
        error: String,
        abi:String,
        testCompiledContract:TestCompiledContract
    }
    input TestCompiledContractInput{
        compilationName:String!,
        smartContract:ID!,
        testPurchasedContract:ID,
        testLicense:ID,
    }
    
`;



module.exports = testCompiledContractTypeDefs;

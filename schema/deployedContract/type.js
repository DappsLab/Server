const {gql} = require('apollo-server-express');


const deployedContractTypeDefs = gql`

    type DeployedContract {
        id: ID!,
        user:User!,
        deplopmentLabel:String!,
        compiledContract:CompiledContract!,
        smartContract:SmartContract!,
        ownerAddress:String!,
        ownerPrivateKey:String!,
        contractAddress:String!,
        transactionAddress:String!,
        balance:String,
        transactions:Int,
        createdAt: String!,
        updatedAt: String!,
    }

    input DeployedContractInput{
        compiledContractId:ID!,
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



module.exports = deployedContractTypeDefs;

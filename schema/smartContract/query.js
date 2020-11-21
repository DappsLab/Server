const {gql} = require('apollo-server-express');


const smartContractQuery = gql`
    extend type Query {
        smartContracts: [SmartContract],
        smartContractById(id:ID!): SmartContract,
    },

    extend type Mutation {
        createSmartContract(newSmartContract: SmartContractInput): SmartContract! @isAuth,
        updateSmartContract(newSmartContract: SmartContractInput, id: ID!): SmartContract! @isAuth,
        deleteSmartContract(id: ID!): SmartContractMessageResponse! @isAuth,
        verifySmartContract(newSmartContract: SmartContractVerify, id: ID!): SmartContract! @isAuth,
        searchSmartContract(searchSmartContract: SearchSmartContract): [SmartContract]!,
        
    }

`;



module.exports = smartContractQuery;

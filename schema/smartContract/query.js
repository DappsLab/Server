const {gql} = require('apollo-server-express');


const smartContractQuery = gql`
    extend type Query {
        smartContracts: [SmartContract],
        smartContractById(id:ID!): SmartContract,
        filterSmartContract(searchSmartContract: SearchSmartContract): [SmartContract],
        searchSmartContract(searchSmartContract: SearchSmartContract): [SmartContract],
    },

    extend type Mutation {
        createSmartContract(newSmartContract: SmartContractInput): SmartContract! @isAuth,
        updateSmartContract(newSmartContract: SmartContractInput, id: ID!): SmartContract! @isAuth,
        deleteSmartContract(id: ID!): SmartContractMessageResponse! @isAuth,
        verifySmartContract(newSmartContract: SmartContractVerify, id: ID!): SmartContract! @isAuth,
    }

`;



module.exports = smartContractQuery;

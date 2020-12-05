const {gql} = require('apollo-server-express');


const smartContractQuery = gql`
    extend type Query {
        smartContracts: [SmartContract],
        verifiedSmartContracts:[SmartContract],
        searchPendingSmartContracts:[SmartContract] @isAuth,
        getSource(id:ID!):String! @isAuth,
        smartContractById(id:ID!): SmartContract,
        filterSmartContract(searchSmartContract: SearchSmartContract): [SmartContract],
        searchSmartContract(searchSmartContract: SearchSmartContract): [SmartContract],
    },

    extend type Mutation {
        createSmartContract(newSmartContract: SmartContractInput): SmartContract! @isAuth,
        updateSmartContract(newSmartContract: SmartContractInput, id: ID!): SmartContract! @isAuth,
        deleteSmartContract(id: ID!): SmartContractMessageResponse! @isAuth,
        verifySmartContract(id: ID!): SmartContract! @isAuth,
        cancelSmartContract(id: ID!): [SmartContract] @isAuth,
    }

`;



module.exports = smartContractQuery;

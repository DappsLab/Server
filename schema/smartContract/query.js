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
    }

`;



module.exports = smartContractQuery;
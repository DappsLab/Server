const {gql} = require('apollo-server-express');


const testPurchasedContractQuery = gql`
    extend type Query {
        testPurchasedContracts:[TestPurchasedContract],
        testPurchasedContractById(id:ID!):TestPurchasedContract,
    }
    extend type Mutation {
        testPurchaseContract(newPurchase:TestPurchasedContractInput):TestPurchasedContract! @isAuth,
    }

`;



module.exports = testPurchasedContractQuery;

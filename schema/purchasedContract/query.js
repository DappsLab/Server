const {gql} = require('apollo-server-express');


const purchasedContractQuery = gql`
    extend type Query {
        purchasedContracts:[PurchasedContract],
        purchasedContractById(id:ID!):PurchasedContract,
    }
    extend type Mutation {
        purchaseContract(newPurchase:PurchasedContractInput):PurchasedContract! @isAuth,
    }

`;



module.exports = purchasedContractQuery;

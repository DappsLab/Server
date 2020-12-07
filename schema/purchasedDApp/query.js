const {gql} = require('apollo-server-express');


const purchasedDAppQuery = gql`
    extend type Query {
        purchasedDApps:[PurchasedDApp],
        purchasedDAppById(id:ID!):PurchasedDApp,
    }
    extend type Mutation {
        purchaseDApp(newPurchase:PurchasedDAppInput):PurchasedDApp! @isAuth,
    }

`;



module.exports = purchasedDAppQuery;

const {gql} = require('apollo-server-express');


const customOrderQuery = gql`
    extend type Query {
        customOrders:[CustomOrder]!,
        customOrderById(id:ID!):CustomOrder,
        searchPendingCustomOrders:[CustomOrder] @isAuth
        searchVerifiedCustomOrders:[CustomOrder] @isAuth
    }
    extend type Mutation {
        createCustomOrder(newCustomOrder:CustomOrderInput!):CustomOrder! @isAuth,
        verifyCustomOrder(id:ID!):Boolean! @isAuth
        cancelCustomOrder(id:ID!):Boolean! @isAuth
        deleteCustomOrder(id:ID!):Boolean! @isAuth
    }

`;



module.exports = customOrderQuery;

const {gql} = require('apollo-server-express');


const orderQuery = gql`
    extend type Query {
        orders:[Order]
        verifyOrder(id:ID):Boolean @isAuth,
    }
    extend type Mutation {
        placeOrder(newOrder: OrderInput!):Order @isAuth,
    }

`;



module.exports = orderQuery;

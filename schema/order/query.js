const {gql} = require('apollo-server-express');


const orderQuery = gql`
    
    extend type Mutation {
        placeOrder(newOrder: OrderInput!):Order @isAuth,
        verifyOrder(id:ID):Boolean @isAuth,
    }

`;



module.exports = orderQuery;

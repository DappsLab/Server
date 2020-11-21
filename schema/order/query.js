const {gql} = require('apollo-server-express');


const orderQuery = gql`
    
    extend type Mutation {
        placeOrder(newOrder: OrderInput!):Order @isAuth,
    }

`;



module.exports = orderQuery;

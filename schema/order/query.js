const {gql} = require('apollo-server-express');


const smartContractQuery = gql`
    extend type Query {
        
    }

    extend type Mutation {
        placeOrder(newOrder: OrderInput!):Order @isAuth,
    }

`;



module.exports = smartContractQuery;

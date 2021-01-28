const {gql} = require('apollo-server-express');


const unBlockRequestQuery = gql`
    extend type Query {
        unBlockRequests:[UnBlockRequest],
        unBlockRequestById(id:ID!):UnBlockRequest,
    }
    extend type Mutation {
        createUnBlockRequest(description:String!):UnBlockRequest! @isAuth,
        cancelUnBlockRequest(id:ID!):Boolean! @isAuth,
    }

`;



module.exports = unBlockRequestQuery;

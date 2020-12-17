const {gql} = require('apollo-server-express');


const testOrderQuery = gql`
    extend type Query {
        testOrders:[TestOrder]
        testOrderById(id:ID!):TestOrder,
        verifyTestOrder(id:ID!):Boolean @isAuth,
    }
    extend type Mutation {
        placeTestOrder(newOrder: TestOrderInput!):TestOrder @isAuth,
    }

`;



module.exports = testOrderQuery;

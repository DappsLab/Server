const {gql} = require('apollo-server-express');


const purchasedDAppTypeDefs = gql`
    
    type PurchasedDApp {
        id: ID!,
        user:User!,
        dApp:DApp!,
        licenses:[License],
        createdAt: String!,
        updatedAt: String!,
    }
    
    input PurchasedDAppInput{
        dAppId: String!,
        orderId:String!,
    }
    
`;



module.exports = purchasedDAppTypeDefs;

const {gql} = require('apollo-server-express');


const licenseTypeDefs = gql`
    
    type License{
        id:ID!,
        used:Boolean!,
        purchasedContract:PurchasedContract,
        purchasedDApp:PurchasedDApp,
        order:Order!,
        purchaseDateTime:String!,
        compilations:[CompiledContract],
    }
`;



module.exports = licenseTypeDefs;

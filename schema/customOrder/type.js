
const {gql} = require('apollo-server-express');


const customOrderTypeDefs = gql`
    
    type CustomOrder {
        id: ID!,
        user:User!,
        role:String,
        businessName:String!,
        businessWebsite:String,
        businessPhone:String!,
        businessEmail:String!,
        productType(productType:ProductType):String!,
        requirements:String!,
        status(status: Status): String!,
        createdAt: String!,
        updatedAt: String!,
    }

    input CustomOrderInput{
        businessName:String!,
        businessWebsite:String,
        businessPhone:String!,
        businessEmail:String!,
        role:String,
        productType:String!,
        requirements:String!,
        status: Status!,
        createdAt: String!,
        updatedAt: String!,
    }

`;



module.exports = customOrderTypeDefs;

import {
    gql
} from "apollo-server-express";


const imageQuery = gql `
    extend type Query {
        hello: String!
    },
    extend type Mutation {
        imageUploader(file: Upload!): String! @isAuth
    }

`
module.exports=imageQuery;
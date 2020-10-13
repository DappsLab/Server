const {gql} = require('apollo-server-express');

const imageQuery = gql `
    
    extend type Query {
        uploads: [File]
    }
     
    extend type Mutation {
        singleUpload(file: Upload!): File!
        imageUploader(file: Upload!): String!
    }

`
module.exports=imageQuery;
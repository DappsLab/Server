const {gql} = require('apollo-server-express');

const contractUploaderQuery = gql `    
     
    extend type Mutation {
        dAppUploader(file: Upload!): String! @isAuth
    }

`
module.exports=contractUploaderQuery;

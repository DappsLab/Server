const {gql} = require('apollo-server-express');

const dAppUploaderQuery = gql `    
     
    extend type Mutation {
        dAppUploader(file: Upload!): String! @isAuth
    }

`
module.exports=dAppUploaderQuery;

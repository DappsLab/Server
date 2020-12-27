const {gql} = require('apollo-server-express');


const compiledContractQuery = gql`
    extend type Query {
        compiledContracts:[CompiledContract]!,
        compiledContractById(id:ID!):CompiledContract,
        getABI(id:ID!):String! @isAuth,
        getBinary(id:ID!):String! @isAuth
    }
    extend type Mutation {
        compileContract(newCompile:CompiledContractInput!):CompiledContract! @isAuth
    }

`;



module.exports = compiledContractQuery;

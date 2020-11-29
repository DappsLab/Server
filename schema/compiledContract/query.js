const {gql} = require('apollo-server-express');


const compiledContractQuery = gql`
    extend type Query {
        compiledContracts:[CompiledContract]!,
        compiledContractById(id:ID!):CompiledContract,
    }
    extend type Mutation {
        compileContract(newCompile:CompiledContractInput!):CompiledContract! @isAuth
    }

`;



module.exports = compiledContractQuery;

const {gql} = require('apollo-server-express');


const testDeployedContractQuery = gql`
    extend type Query {
        testDeployedContracts:[TestDeployedContract]!,
        testDeployedContractById(id:ID!):TestDeployedContract,
    }
    extend type Mutation {
        testDeployContract(compiledContractId:ID!):TestDeployedContract! @isAuth
    }

`;



module.exports = testDeployedContractQuery;

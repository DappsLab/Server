const {gql} = require('apollo-server-express');


const deployedContractQuery = gql`
    extend type Query {
        deployedContracts:[DeployedContract]!,
        deployedContractById(id:ID!):DeployedContract,
    }
    extend type Mutation {
        deployContract(compiledContractId:ID!):DeployedContract! @isAuth
    }

`;



module.exports = deployedContractQuery;

const {gql} = require('apollo-server-express');


const deployedContractQuery = gql`
    extend type Query {
        deployedContracts:[DeployedContract]!,
        deployedContractById(id:ID!):DeployedContract,
    }
    extend type Mutation {
        deployContract(newDeploy:DeployedContractInput):DeployedContract! @isAuth
    }

`;



module.exports = deployedContractQuery;

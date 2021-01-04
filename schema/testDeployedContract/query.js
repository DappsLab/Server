const {gql} = require('apollo-server-express');


const testDeployedContractQuery = gql`
    extend type Query {
        testDeployedContracts:[TestDeployedContract]!,
        testDeployedContractById(id:ID!):TestDeployedContract,
    }
    extend type Mutation {
        augumentsValidator(newArguments:[Argument]): Boolean
        testDeployContract(newDeploy:TestDeployedContractInput):TestDeployedContract! @isAuth
    }

`;



module.exports = testDeployedContractQuery;

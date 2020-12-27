const {gql} = require('apollo-server-express');


const testCompiledContractQuery = gql`
    extend type Query {
        testCompiledContracts:[TestCompiledContract]!,
        testCompiledContractById(id:ID!):TestCompiledContract,
        testGetABI(id:ID!):String! @isAuth,
        testGetBinary(id:ID!):String! @isAuth
    }
    extend type Mutation {
        testCompileContract(newCompile:TestCompiledContractInput!):TestCompiledContract! @isAuth
        testCompiledContractVersion(smartContractId:ID!,version:String!):TestCompiledContractVersion! @isAuth
    }

`;



module.exports = testCompiledContractQuery;

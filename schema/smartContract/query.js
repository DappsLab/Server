const {gql} = require('apollo-server-express');


const smartContractQuery = gql`
    type Query {
        smartContracts: [SmartContract],
        smartContractById(id:ID!): SmartContract,
    },

    type Mutation {
        createSmartContract(
            contractName: String,
            contractCategory: String,
            image: String,
            shortDescription: String,
            description: String,
            singleLicensePrice: String,
            unlimitedLicensePrice: String,
            source: String,
            publisher:String,#ID
            publishingDateTime:String,
            verified: String,
            verifiedBy: String,#ID
            verifiedDateTime:String,
            purchasedCounts: Int,
            compiledCounts: Int,
            testedCounts: Int,
            deployedCounts: Int,
        ): SmartContract,
    }

`;



module.exports = smartContractQuery;
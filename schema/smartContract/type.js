const {gql} = require('apollo-server-express');
const User = require('../../models/smartContract.js');
const _ = require('lodash');

const smartContractTypeDefs = gql`
    type SmartContract {
        id: ID!,
        contractName: String,
        contractCategory:[Category],
        image: String,
        shortDescription: String,
        description: String,
        singleLicensePrice: String,
        unlimitedLicensePrice: String,
        source: String,
        publisher:User,#ID
        publishingDateTime:String,
        verified(verified:Verified): String!,
        verifiedBy: User!,#ID
        verifiedDateTime:String,
        purchasedCounts: Int,
        compiledCounts: Int,
        testedCounts: Int,
        deployedCounts: Int
    },
    enum Category {
        DOCUMENTS
        ESCROW
        FINANCIAL
        SOCIAL
        TOOLS
        UTILITY
    },
    enum Verified {
        NOT_VERIFIED
        PENDING
        VERIFIED
    }
    
`;



module.exports = smartContractTypeDefs;
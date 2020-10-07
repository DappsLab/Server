const {gql} = require('apollo-server-express');
const User = require('../../models/smartContract.js');
const _ = require('lodash');

const smartContractTypeDefs = gql`
    
    input SmartContractInput{
        contractName: String!,
        contractCategory:[Category],
        image: String,
        shortDescription: String,
        description: String,
        singleLicensePrice: String,
        unlimitedLicensePrice: String,
        source: String,
        publisher:String,#ID
        publishingDateTime:String,
        verified: Verified!,
        verifiedBy: String,#ID
        verifiedDateTime:String,
        purchasedCounts: String,
        compiledCounts: String,
        testedCounts: String,
        deployedCounts: String,
    },
    
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
        publisher:User!,#ID
        publishingDateTime:String,
        verified(verified:Verified): String!,
        verifiedBy: User,#ID
        verifiedDateTime:String,
        purchasedCounts: String,
        compiledCounts: String,
        testedCounts: String,
        deployedCounts: String,
        createdAt: String!
        updatedAt: String!
    },
    
    
    type SmartContractMessageResponse {
        message: String!
        success: Boolean
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
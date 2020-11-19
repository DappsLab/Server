const {gql} = require('apollo-server-express');


const smartContractTypeDefs = gql`
    
    input SmartContractInput{
        contractName: String!,
        contractCategory:[Category!]!,
        image: String!,
        shortDescription: String!,
        description: String!,
        singleLicensePrice: String!,
        unlimitedLicensePrice: String!,
        source: String!,
    },
    input SmartContractVerify{
        verified:Verified!,
    }
    
    type SmartContract {
        id: ID!,
        contractName: String,
#        kycStatus(status: Status): String!
        contractCategory(category:Category):[String],
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


const RequestActionEnum = {
    TOOLS: 'TOOLS',
    SOCIAL: 'SOCIAL',
    ESCROW: 'ESCROW'
}
let array = [RequestActionEnum.TOOLS, RequestActionEnum.SOCIAL, RequestActionEnum.ESCROW];
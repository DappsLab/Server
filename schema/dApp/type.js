const {gql} = require('apollo-server-express');


const DAppsTypeDefs = gql`

    type DApp {
        id: ID!,
        dAppName: String,
        image: String,
        tags:[String],
        dAppCategory(category:Category):[String],
        shortDescription: String,
        description: String,
        singleLicensePrice: String,
        zip: String,
        publisher:User!,
        publishingDateTime:String,
        verifiedBy:User!,
        verifiedDateTime:String,
        verified(verified:Verified): String!,
        purchasedCounts:Int!,
        createdAt: String!,
        updatedAt: String!,
    }
    
    input DAppInput{
        dAppName: String,
        image: String,
        tags:[String],
        dAppCategory:[Category!]!,
        shortDescription: String,
        description: String,
        singleLicensePrice: String,
        zip: String,
    }
    
    input SearchDApp{
        dAppName: String,
        dAppCategory:[Category],
        maxPrice:String,
        minPrice:String,
        tags:[String],
        sortBy:Sort,
    }

    type DAppMessageResponse {
        message: String!
        success: Boolean
    },
`;



module.exports = DAppsTypeDefs;

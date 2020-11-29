const {gql} = require('apollo-server-express');


const purchasedContractTypeDefs = gql`
    
    type PurchasedContract {
        id: ID!,
        user:User!,
        smartContract:SmartContract!,
        unlimitedCustomization:Boolean!,
        customizationsLeft:Int!,
        licenses:[License],
        createdAt: String!,
        updatedAt: String!,
    }
    
    input PurchasedContractInput{
        smartContractId: String!,
        orderId:String!,
    }
    type License{
        order:Order!,
        purchaseDateTime:String!,
        compilations:[CompiledContract],
    }
`;



module.exports = purchasedContractTypeDefs;

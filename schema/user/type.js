const {gql} = require('apollo-server-express');


const userTypeDefs = gql`

    input UserRegisterInput  {
        fullName: String!,
        userName: String!,
        email: String!,
        password: String!,
    }

    input UserInput {
        fullName: String,
        avatar: String,
        balance: String,
        location: String,
        type:Type,
    }
    
    type User {
        id: ID!,
        fullName: String!,
        userName: String!,
        email: String!,
        password: String!,
        confirmed: Boolean!,
        resetPasswordToken: String,
        emailConfirmToken: String,
        avatar: String,
        address: String!,
        balance: String!,
        location: String,
        type(type:Type): String,
        createdAt: String
        updatedAt: String
        kyc: Kyc,
        testAddress:[TestAddress],
        wallet:Wallet,
        smartContracts:[SmartContract],
    }

    type Wallet{
        privateKey:String,
        publicKey:String,
    },
    
    type Kyc {
        mobile: String,
        birthDate: String,
        nationality: String,
        country: String,
        postalCode: String,
        city: String,
        streetName: String,
        streetNumber: String,
        kycStatus(status: Status): String!
    }

    enum Status {
        NOT_VERIFIED
        PENDING
        VERIFIED
    }

    enum Type {
        ADIMN
        USER
    }

    type TestAddress{
        address: String,
        balance: String,
        password: String
    }

    type AuthUser {
        user: User!
        token:String!
    }

`;



module.exports = userTypeDefs;
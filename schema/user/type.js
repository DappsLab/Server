const {gql} = require('apollo-server-express');
const User = require('../../models/user');
const Kyc = require('../../models/kyc');
const _ = require('lodash');

const userTypeDefs = gql`    
    type User {
        id: ID!,
        fullName: String!,
        userName: String!,
        email: String!,
        password: String!,
        avatar: String!,
        address: String,
        balance: String!,
        location: String,
        kyc: Kyc,
        testAddress:[TestAddress]
    }

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

    type TestAddress{
        address: String,
        balance: String,
        password: String
    }

`;



module.exports = userTypeDefs;
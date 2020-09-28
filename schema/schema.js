const {gql} = require('apollo-server-express');
const User = require('../models/user');
const Kyc = require('../models/kyc');
const _ = require('lodash');

const typeDefs = gql`
    type Query {
        users: [User]
        me:User
    },
    
    type Mutation {
        addUser(
            fullName: String,
            userName:String,
            email:String,
            password:String,
            avatar:String,
            address:String,
            balance:String,
            location:String
        ): User,
        editUser(
            id: String!,
            fullName: String,
            userName:String,
            email:String,
            password:String,
            avatar:String,
            address:String,
            balance:String,
            location:String
        ):User,
        deleteUser(
            id: String!,
        ):User,
        addKyc(
            id:String!,
            mobile:String,
            birthDate:String,
            nationality:String,
            country:String,
            postalCode:String,
            city:String,
            streetName:String,
            streetNumber:String,
            kycStatus:Status #hello
        ):User,
        editKyc(
            id:String!,
            mobile:String,
            birthDate:String,
            nationality:String,
            country:String,
            postalCode:String,
            city:String,
            streetName:String,
            streetNumber:String,
            kycStatus:Status #hello
        ):User,
        addTestAddress(
            id:String!,
            address:String!,
            balance: String!,
            password: String!
        ):User,
        editTestAddress(
            id:String!,
            address:String!,
            balance: String!,
            password: String!
        ):User,
    },
    
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



module.exports = typeDefs;
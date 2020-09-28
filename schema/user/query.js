const {gql} = require('apollo-server-express');
const {userTypeDefs} = require('./type.js')
const User = require('../../models/user.js');
const Kyc = require('../../models/kyc');
const _ = require('lodash');

const userQuery = gql`
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
        ):User
    }
    
`;



module.exports = userQuery;
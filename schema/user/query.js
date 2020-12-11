const {gql} = require('apollo-server-express');

const userQuery = gql`
    extend type Query {
        authUser: User @isAuth,
        loginUser(userName: String!, password: String!):AuthUser!,
        verify2FA(token: String!):Boolean! @isAuth,
        users: [User],
        me:User! @isAuth,
#        getBalance:User! @isAuth,
        userById(id:ID!):User,
        searchPendingKyc:[User] @isAuth,
    },
    
    extend type Mutation {
        verifyKyc(id:ID!):Boolean @isAuth,
        cancelKyc(id:ID!):Boolean @isAuth,
        registerUser(newUser: UserRegisterInput!): AuthUser!,
        editUser(newUser: UserInput!): User @isAuth,
        confirmEmail(token: String!): Boolean!,
        forgetPassword(email: String!): Boolean!,
        resetPassword(token: String!, password:String!): Boolean!,
        changePassword(token: String!):User,
        enable2FA:User @isAuth,
        disable2FA:Boolean! @isAuth,
        addUser(
            fullName: String,
            userName:String,
            email:String,
            password:String,
        ): User,
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
            street:String,
            building:String,
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
            street:String,
            building:String,
            kycStatus:Status #hello
        ):User,
        addTestAddress:User! @isAuth,
        deleteTestAddress(id:ID!,testAddressId:ID!):User! @isAuth,
        request5DAppsCoin:User! @isAuth,
    }
    
`;



module.exports = userQuery;

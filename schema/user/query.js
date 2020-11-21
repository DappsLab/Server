const {gql} = require('apollo-server-express');

const userQuery = gql`
    extend type Query {
        authUser: User @isAuth,
        loginUser(userName: String!, password: String!):AuthUser!,
        verify2FA(token: String!):Boolean! @isAuth,
        users: [User],
        me:User @isAuth,
        userById(id:ID!):User,
    },
    
    extend type Mutation {
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
#        editUser(
#            id: String!,
#            fullName: String,
#            userName:String,
#            email:String,
#            password:String,
#            avatar:String,
#            address:String,
#            balance:String,
#            location:String,
#            type:Type,
#        ):User,
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
            stree:String,
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
        addTestAddress(
            id:String!,
            address:String,
            balance: String,
            password: String
        ):User,
        editTestAddress(
            id:String!,
            address:String,
            balance: String,
            password: String
        ):User
    }
    
`;



module.exports = userQuery;

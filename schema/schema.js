const graphql = require('graphql');
const User = require('../models/user');
const _ = require('lodash');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLBoolean
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: ( ) => ({
        id: { type: GraphQLID },
        fullName: { type: GraphQLString },
        userName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        avatar: { type: GraphQLString },
        address: { type: GraphQLString },
        balance: { type: GraphQLString },
        location: { type: GraphQLString },
        kyc: { type: KYCType },
        testAddress: {
            type: new GraphQLList(TestAddressType)
        }
    })
});

const KYCType = new GraphQLObjectType({
    name: 'KYC',
    fields: ( ) => ({
        mobile: { type: GraphQLString },
        birthDate: { type: GraphQLString },
        nationality: { type: GraphQLString },
        country: { type: GraphQLString },
        postalCode: { type: GraphQLString },
        city: { type: GraphQLString },
        streetName: { type: GraphQLString },
        streetNumber: { type: GraphQLString },
        kycVerified: { type: GraphQLBoolean }
    })
});

const TestAddressType = new GraphQLObjectType({
    name: 'TestAddress',
    fields: ( ) => ({
        address: { type: GraphQLString },
        balance: { type: GraphQLString },
        password: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return User.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args){
                return User.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                fullName: { type:  new GraphQLNonNull(GraphQLString) },
                userName: { type:  new GraphQLNonNull(GraphQLString) },
                email: { type:  new GraphQLNonNull(GraphQLString) },
                password: { type:  new GraphQLNonNull(GraphQLString) },
                avatar: { type:  new GraphQLNonNull(GraphQLString) },
                address: { type:  new GraphQLNonNull(GraphQLString) },
                balance: { type:  new GraphQLNonNull(GraphQLString) },
                location: { type:  new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
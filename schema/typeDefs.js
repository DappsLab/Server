// const {gql} = require('apollo-server-express');
const { mergeTypeDefs } = require('@graphql-tools/merge');
// const _ = require('lodash');

const userQuery = require('./user/query.js')
const userTypeDefs =require('./user/type')

const typeDefs = [
    userTypeDefs,
    userQuery,
];

module.exports = mergeTypeDefs(typeDefs);
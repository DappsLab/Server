// const {gql} = require('apollo-server-express');
const { mergeTypeDefs } = require('@graphql-tools/merge');
// const _ = require('lodash');

const userQuery = require('./user/query.js')
const userTypeDefs =require('./user/type')
const baseTypeDefs =require('./baseDefs.js')
const smartContractTypeDefs =require('./smartContract/type.js')
const smartContractQuery = require('./smartContract/query.js')

const typeDefs = [
    baseTypeDefs,
    userTypeDefs,
    userQuery,
    smartContractTypeDefs,
    smartContractQuery,
];

module.exports = mergeTypeDefs(typeDefs);
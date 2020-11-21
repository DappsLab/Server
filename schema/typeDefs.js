// const {gql} = require('apollo-server-express');
const { mergeTypeDefs } = require('@graphql-tools/merge');
// const _ = require('lodash');

const userQuery = require('./user/query.js')
const userTypeDefs =require('./user/type')
const baseTypeDefs =require('./baseDefs.js')
const smartContractTypeDefs =require('./smartContract/type.js')
const smartContractQuery = require('./smartContract/query.js')
const imageTypeDefs = require('./image/type.js')
const imageQuery = require('./image/query.js')
const orderTypeDefs = require('./order/type.js')
const orderQuery = require('./order/query.js')
const contractUploaderQuery = require('./contractUploader/query.js')

const typeDefs = [
    baseTypeDefs,
    userTypeDefs,
    userQuery,
    smartContractTypeDefs,
    smartContractQuery,
    imageTypeDefs,
    imageQuery,
    orderTypeDefs,
    orderQuery,
    contractUploaderQuery
];

module.exports = mergeTypeDefs(typeDefs);

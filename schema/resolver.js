const { mergeResolvers } = require('@graphql-tools/merge');
const userResolver = require('./user/resolver.js');
const smartContractResolver = require('./smartContract/resolver.js');

const resolvers = [
    userResolver,
    smartContractResolver,
];

module.exports = mergeResolvers(resolvers);
const { mergeResolvers } = require('@graphql-tools/merge');
const userResolver = require('./user/resolver.js');
const smartContractResolver = require('./smartContract/resolver.js');
const imageResolver = require('./image/resolver.js');

const resolvers = [
    userResolver,
    smartContractResolver,
    imageResolver,
];

module.exports = mergeResolvers(resolvers);
const { mergeResolvers } = require('@graphql-tools/merge');
const userResolver = require('./user/resolver.js');
const smartContractResolver = require('./smartContract/resolver.js');
const image = require('./image/resolver.js');

const resolvers = [
    userResolver,
    smartContractResolver,
    image
];

module.exports = mergeResolvers(resolvers);
const { mergeResolvers } = require('@graphql-tools/merge');
const clientResolver = require('./user/resolver.js');
// const productResolver = require('./productResolver');

const resolvers = [
    clientResolver,
];

module.exports = mergeResolvers(resolvers);
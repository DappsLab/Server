const { mergeResolvers } = require('@graphql-tools/merge');
const userResolver = require('./user/resolver.js');
const smartContractResolver = require('./smartContract/resolver.js');
const imageResolver = require('./image/resolver.js');
const contractUploaderResolver = require('./contractUploader/resolver.js');
const orderResolver = require('./order/resolver.js');
const purchasedContractResolver = require('./purchasedContract/resolver.js');


const resolvers = [
    userResolver,
    smartContractResolver,
    imageResolver,
    contractUploaderResolver,
    orderResolver,
    purchasedContractResolver,
];

module.exports = mergeResolvers(resolvers);

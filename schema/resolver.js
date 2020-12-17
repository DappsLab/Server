const { mergeResolvers } = require('@graphql-tools/merge');
const userResolver = require('./user/resolver.js');
const smartContractResolver = require('./smartContract/resolver.js');
const imageResolver = require('./image/resolver.js');
const contractUploaderResolver = require('./contractUploader/resolver.js');
const orderResolver = require('./order/resolver.js');
const testOrderResolver = require('./testOrder/resolver.js');
const purchasedContractResolver = require('./purchasedContract/resolver.js');
const compiledContractResolver = require('./compiledContract/resolver.js')
const licenseResolver = require('./license/resolver.js')
const deployedContractResolver = require('./deployedContract/resolver.js')
const customOrderResolver = require('./customOrder/resolver.js')
const dAppResolver = require('./dapp/resolver.js')
const dAppUploaderResolver = require('./dAppUploader/resolver.js')

const resolvers = [
    userResolver,
    smartContractResolver,
    imageResolver,
    contractUploaderResolver,
    orderResolver,
    testOrderResolver,
    purchasedContractResolver,
    compiledContractResolver,
    licenseResolver,
    deployedContractResolver,
    customOrderResolver,
    dAppResolver,
    dAppUploaderResolver,
];

module.exports = mergeResolvers(resolvers);

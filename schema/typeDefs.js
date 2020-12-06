const { mergeTypeDefs } = require('@graphql-tools/merge');

const userQuery = require('./user/query.js')
const userTypeDefs =require('./user/type')
const baseTypeDefs =require('./baseDefs.js')
const smartContractTypeDefs =require('./smartContract/type.js')
const smartContractQuery = require('./smartContract/query.js')
const imageTypeDefs = require('./image/type.js')
const imageQuery = require('./image/query.js')
const orderTypeDefs = require('./order/type.js')
const orderQuery = require('./order/query.js')
const purchasedContractTypeDefs = require('./purchasedContract/type.js')
const purchasedContractQuery = require('./purchasedContract/query.js')
const contractUploaderQuery = require('./contractUploader/query.js')
const compiledContractTypeDefs = require('./compiledContract/type')
const compiledContractQuery = require('./compiledContract/query')
const licenseTypeDefs = require('./license/type')
const licenseQuery = require('./license/query')
const deployedContractQuery = require('./deployedContract/query')
const deployedContractTypeDefs = require('./deployedContract/type')
const customOrderQuery = require('./customOrder/query')
const customOrderTypeDefs = require('./customOrder/type')
const dAppTypeDefs = require('./dApp/type')
const dAppQueryDefs = require('./dApp/query')

const typeDefs = [
    baseTypeDefs,
    contractUploaderQuery,
    userTypeDefs,
    userQuery,
    smartContractTypeDefs,
    smartContractQuery,
    imageTypeDefs,
    imageQuery,
    orderTypeDefs,
    orderQuery,
    purchasedContractTypeDefs,
    purchasedContractQuery,
    compiledContractTypeDefs,
    compiledContractQuery,
    licenseTypeDefs,
    licenseQuery,
    deployedContractQuery,
    deployedContractTypeDefs,
    customOrderTypeDefs,
    customOrderQuery,
    dAppTypeDefs,
    dAppQueryDefs,

];

module.exports = mergeTypeDefs(typeDefs);

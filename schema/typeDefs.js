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
const testOrderTypeDefs = require('./testOrder/type.js')
const testOrderQuery = require('./testOrder/query.js')
const purchasedContractTypeDefs = require('./purchasedContract/type.js')
const purchasedContractQuery = require('./purchasedContract/query.js')
const testPurchasedContractTypeDefs = require('./testPurchasedContract/type.js')
const testPurchasedContractQuery = require('./testPurchasedContract/query.js')
const contractUploaderQuery = require('./contractUploader/query.js')
const compiledContractTypeDefs = require('./compiledContract/type')
const compiledContractQuery = require('./compiledContract/query')
const testCompiledContractTypeDefs = require('./testCompiledContract/type')
const testCompiledContractQuery = require('./testCompiledContract/query')
const licenseTypeDefs = require('./license/type')
const licenseQuery = require('./license/query')
const testLicenseTypeDefs = require('./testLicense/type')
const testLicenseQuery = require('./testLicense/query')
const deployedContractQuery = require('./deployedContract/query')
const deployedContractTypeDefs = require('./deployedContract/type')
const testDeployedContractQuery = require('./testDeployedContract/query')
const testDeployedContractTypeDefs = require('./testDeployedContract/type')
const customOrderQuery = require('./customOrder/query')
const customOrderTypeDefs = require('./customOrder/type')
const dAppTypeDefs = require('./dApp/type')
const dAppQueryDefs = require('./dApp/query')
const purchasedDAppTypeDefs = require('./purchasedDApp/type')
const purchasedDAppQuery = require('./purchasedDApp/query')
const dAppUploaderQuery = require('./dAppUploader/query')

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
    testOrderTypeDefs,
    testOrderQuery,
    purchasedContractTypeDefs,
    purchasedContractQuery,
    testPurchasedContractTypeDefs,
    testPurchasedContractQuery,
    compiledContractTypeDefs,
    compiledContractQuery,
    testCompiledContractTypeDefs,
    testCompiledContractQuery,
    licenseTypeDefs,
    licenseQuery,
    testLicenseTypeDefs,
    testLicenseQuery,
    deployedContractQuery,
    deployedContractTypeDefs,
    testDeployedContractQuery,
    testDeployedContractTypeDefs,
    customOrderTypeDefs,
    customOrderQuery,
    dAppTypeDefs,
    dAppQueryDefs,
    purchasedDAppTypeDefs,
    purchasedDAppQuery,
    dAppUploaderQuery,

];

module.exports = mergeTypeDefs(typeDefs);

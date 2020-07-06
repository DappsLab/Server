const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const smartContractSchema = new Schema({
    contractName: String,
    contractCategory: String,
    image: String,
    shortDescription: String,
    description: String,
    singleLicensePrice: String,
    unlimitedLicensePrice: String,
    source: String,
    publisher: mongoose.ObjectId,
    publishingDateTime:String,
    verified: String,
    verifiedBy: mongoose.ObjectId,
    verifiedDateTime:String,
    purchasedCounts: Number,
    compiledCounts: Number,
    testedCounts: Number,
    deployedCounts: Number

});

module.exports = mongoose.model('SmartContract', smartContractSchema);

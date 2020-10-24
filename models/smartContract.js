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
    // publisher: mongoose.ObjectId,
    publishingDateTime:String,
    verified: {
        type: String,
        default:"NOT_VERIFIED"
    },
    // verifiedBy: mongoose.ObjectId,
    verifiedDateTime:String,
    purchasedCounts: String,
    compiledCounts: String,
    testedCounts: String,
    deployedCounts: String,
    publisher: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    verifiedBy: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },

}, {
    timestamps: true
});

module.exports = mongoose.model('smartcontracts', smartContractSchema);

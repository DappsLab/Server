const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const smartContractSchema = new Schema({
    contractName: String,
    contractCategory:[String],
    image: String,
    tags:[String],
    shortDescription: String,
    description: String,
    singleLicensePrice: String,
    unlimitedLicensePrice: String,
    source: String,
    sourceContractName: String,
    // publisher: mongoose.ObjectId,
    publishingDateTime:String,
    compilerVersion: String,
    verified: {
        type: String,
        default:"PENDING"
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
    preCompiled: {
        ref: 'compiledcontracts',
        type: Schema.Types.ObjectId
    },
    verifiedBy: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },

}, {
    timestamps: true
});

const SmartContract = mongoose.model('smartcontracts', smartContractSchema);
export default SmartContract;

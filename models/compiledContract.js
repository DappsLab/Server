const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const compiledContractSchema = new Schema({
    smartContract: {
        ref: 'smartcontracts',
        type: Schema.Types.ObjectId
    },
    compiledOn:String,
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    ownerAddress: String,
    abi: String,
    binary: String,
    deployments:[{
        ref: 'deployedcontracts',
        type: Schema.Types.ObjectId
    }],
});

module.exports = mongoose.model('CompiledContract', compiledContractSchema);

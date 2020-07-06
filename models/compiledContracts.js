const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const compiledContractSchema = new Schema({
    contractId: mongoose.ObjectId,
    compiledOn:String,
    ownerAddress: String,
    abi: String,
    binary: String

});

module.exports = mongoose.model('CompiledContract', compiledContractSchema);

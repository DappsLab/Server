const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const compiledContractSchema = new Schema({
    smartContractId: mongoose.ObjectId,
    compiledOn:String,
    userId: mongoose.ObjectId,
    ownerAddress: String,
    abi: String,
    binary: String

});

module.exports = mongoose.model('CompiledContract', compiledContractSchema);

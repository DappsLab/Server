const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deployedContractSchema = new Schema({
    smartContractId: mongoose.ObjectId,
    compiledContractId: mongoose.ObjectId,
    contractAddress: String,
    balance: String,
    transactions: Number,
    createdAtTxn: String,
    createdAtBalance: String
});

module.exports = mongoose.model('DeployedContract', deployedContractSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deployedContractSchema = new Schema({
    deploymentLabel:String,
    fee:String,
    smartContract:{
        ref: 'smartcontracts',
        type: Schema.Types.ObjectId
    },
    compiledContract: {
        ref: 'compiledcontracts',
        type: Schema.Types.ObjectId
    },
    contractAddress: String,
    transactionAddress:String,
    balance: String,
    transactions: Number,
    createdAtTxn: String,
    createdAtBalance: String
});

const DeployedContract = mongoose.model('deployedcontracts', deployedContractSchema);
export default DeployedContract;

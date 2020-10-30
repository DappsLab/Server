const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testDeployedContractSchema = new Schema({
    deploymentLabel:String,
    fee:String,
    smartContract:{
        ref: 'smartcontracts',
        type: Schema.Types.ObjectId
    },
    compiledContract: {
        ref: 'testcompiledcontracts',
        type: Schema.Types.ObjectId
    },
    contractAddress: String,
    transactionAddress:String,
    balance: String,
    transactions: Number,
    createdAtTxn: String,
    createdAtBalance: String
});


const TestDeployedContract = mongoose.model('testdeployedcontracts', testDeployedContractSchema);

export default TestDeployedContract;
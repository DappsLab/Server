const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deployedContractSchema = new Schema({
    deploymentLabel:String,
    smartContract:{
        ref: 'smartcontracts',
        type: Schema.Types.ObjectId
    },
    user:{
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    compiledContract: {
        ref: 'testcompiledcontracts',
        type: Schema.Types.ObjectId
    },
    contractAddress: String,
    transactionAddress:String,
    balance: {
        type:String,
        default:"",
    },
    ownerAddress:{
        type:String,
        default:"",
    },
    transactions:{
        type:Number,
        default:0
    },
    deploymentFee: String,
});
const DeployedContract = mongoose.model('deployedcontracts', deployedContractSchema);
export default DeployedContract;

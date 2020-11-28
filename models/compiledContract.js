const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const compiledContractSchema = new Schema({
    smartContract: {
        ref: 'smartcontracts',
        type: Schema.Types.ObjectId
    },
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

const CompiledContract = mongoose.model('compiledcontracts', compiledContractSchema);
export default CompiledContract;

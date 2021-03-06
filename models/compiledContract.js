const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const compiledContractSchema = new Schema({
    compilationName: String,
    smartContract: {
        ref: 'smartcontracts',
        type: Schema.Types.ObjectId
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    purchasedContract:{
        ref:'purchasedcontracts',
        type: Schema.Types.ObjectId,
    },
    license:{
        ref: 'licenses',
        type: Schema.Types.ObjectId,
    },
    compiledFile:{
        type:String,
        default:"",
    },
    used:{
        type:Boolean,
        default:false,
    },
    deployments:[{
        ref: 'deployedcontracts',
        type: Schema.Types.ObjectId
    }],
});

const CompiledContract = mongoose.model('compiledcontracts', compiledContractSchema);
export default CompiledContract;

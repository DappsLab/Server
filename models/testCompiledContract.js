const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testCompiledContractSchema = new Schema({
    compilationName: String,
    smartContract: {
        ref: 'smartcontracts',
        type: Schema.Types.ObjectId
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    testPurchasedContract:{
        ref:'testpurchasedcontracts',
        type: Schema.Types.ObjectId,
    },
    testLicense:{
        ref: 'testlicenses',
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
    testDeployments:[{
        ref: 'testdeployedcontracts',
        type: Schema.Types.ObjectId
    }],
});

const TestCompiledContract = mongoose.model('testcompiledcontracts', testCompiledContractSchema);
export default TestCompiledContract;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testPurchasedContractSchema = new Schema({
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    smartContract: {
        ref: 'smartcontracts',
        type: Schema.Types.ObjectId
    },
    unlimitedCustomization:{
        type:Boolean,
        default:false,
    },
    customizationsLeft:{
        type:Number,
        default:0,
    },
    testLicenses: [{
    ref: 'testlicenses',
        type: Schema.Types.ObjectId
    }],

}, {
    timestamps: true
});


const TestPurchasedContract = mongoose.model('testpurchasedcontracts', testPurchasedContractSchema);

export default TestPurchasedContract;

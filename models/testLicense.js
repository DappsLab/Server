const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testLicenseSchema = new Schema({
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    testOrder: {
        ref: 'testorders',
        type: Schema.Types.ObjectId,
    },
    used:{
        type:Boolean,
        default:false,
    },
    testPurchasedContract: {
        ref: 'testpurchasedcontracts',
        type: Schema.Types.ObjectId,
    },
    testCompilations: [{
        ref:'testcompiledcontracts',
        type:Schema.Types.ObjectId,
    }],
    purchaseDateTime:String,
}, {
    timestamps: true
});


const TestLicense = mongoose.model('testlicenses', testLicenseSchema);

export default TestLicense;

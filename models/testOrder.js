const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testOrderSchema = new Schema({
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    price:String,
    licenseType:String,
    dateTime:String,
    productType:String,
    address:String,
    status:String,
    transactionHash:String,
    fee:String,
    orderUsed:{
        type:Boolean,
        default:false
    },
    smartContract:{
        ref: 'smartcontracts',
        type: Schema.Types.ObjectId,
    },
    testAddress:{
        type: Schema.Types.ObjectId,
    },
    wallet: {
        privateKey: String,
        publicKey: String,
    },
    dApp:{
        type: Schema.Types.ObjectId,
        ref: 'dApps'
    }
}, {
    timestamps: true
});


const TestOrder = mongoose.model('testorders', testOrderSchema);

export default TestOrder;

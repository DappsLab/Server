const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    price:String,
    licenseType:String,
    dateTime:String,
    productType:String,
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
    address:String,
    wallet: {
        privateKey: String,
        publicKey: String,
    },
    transactionToPublisher:{
        type:String,
        default:""
    },
    dApp:{
        type: Schema.Types.ObjectId,
        ref: 'dApps'
    }
}, {
    timestamps: true
});


const Order = mongoose.model('orders', orderSchema);

export default Order;

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
    transactionHash:String,
    fee:String,
    smartContract:{
            type: Schema.Types.ObjectId,
        ref: 'smartcontracts'
    },
    address:String,
    wallet: {
        privateKey: String,
        publicKey: String,
    },
    // dapp:{
    //     type: Schema.Types.ObjectId,
    //     ref: 'dapps'
    // }
}, {
    timestamps: true
});


const Order = mongoose.model('orders', orderSchema);

export default Order;

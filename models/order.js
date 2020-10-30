const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    price:String,
    dateTime:String,
    smartContract:{
        type: Schema.Types.ObjectId,
        ref: 'smartcontracts'
    }
});


const Order = mongoose.model('orders', orderSchema);

export default Order;
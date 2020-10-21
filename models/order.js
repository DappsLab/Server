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

module.exports = mongoose.model('Order', orderSchema);

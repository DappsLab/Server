const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchasedContractSchema = new Schema({
    licenses: [{
        orderID:{
            ref: 'orders',
            type: Schema.Types.ObjectId
        },
        customizationsLeft:String,
        purchasedDateTime:String,
    }],
    smartContract: {
        ref: 'smartcontracts',
        type: Schema.Types.ObjectId
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    compilations:[{
        ref: 'compiledcontracts',
        type: Schema.Types.ObjectId
    }],

}, {
    timestamps: true
});

module.exports = mongoose.model('PurchasedContract', purchasedContractSchema);

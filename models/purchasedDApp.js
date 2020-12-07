const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchasedDAppSchema = new Schema({
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    dApp: {
        ref: 'dApp',
        type: Schema.Types.ObjectId
    },
    licenses: [{
    ref: 'licenses',
        type: Schema.Types.ObjectId
    }],

}, {
    timestamps: true
});


const PurchasedDApp = mongoose.model('purchaseddApps', purchasedDAppSchema);

export default PurchasedDApp;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchasedContractSchema = new Schema({
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
    licenses: [{
    ref: 'licenses',
        type: Schema.Types.ObjectId
    }],

}, {
    timestamps: true
});


const PurchasedContract = mongoose.model('purchasedcontracts', purchasedContractSchema);

export default PurchasedContract;

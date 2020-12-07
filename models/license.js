const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const licenseSchema = new Schema({
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    order: {
        ref: 'orders',
        type: Schema.Types.ObjectId,
    },
    used:{
        type:Boolean,
        default:false,
    },
    purchasedContract: {
        ref: 'purchasedcontracts',
        type: Schema.Types.ObjectId,
    },
    purchasedDApp: {
        ref: 'purchaseddApps',
        type: Schema.Types.ObjectId,
    },
    compilations: [{
        ref:'compiledcontracts',
        type:Schema.Types.ObjectId,
    }],
    purchaseDateTime:String,
}, {
    timestamps: true
});


const License = mongoose.model('licenses', licenseSchema);

export default License;

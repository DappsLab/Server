const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dappSchema = new Schema({
    dappName: String,
    image: String,
    tags:[String],
    shortDescription: String,
    description: String,
    singleLicensePrice: String,
    source: String,
    publishingDateTime:String,
    verified: {
        type: String,
        default:"PENDING"
    },
    verifiedDateTime:String,
    purchasedCounts: String,
    publisher: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    verifiedBy: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },

}, {
    timestamps: true
});

const Dapp = mongoose.model('dapps', dappSchema);
export default Dapp;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dAppSchema = new Schema({
    dAppName: String,
    image: String,
    tags:[String],
    shortDescription: String,
    description: String,
    singleLicensePrice: String,
    zip: String,
    publishingDateTime:String,
    dAppCategory:[{
        type:String,
    }],
    verified: {
        type: String,
        default:"PENDING"
    },
    verifiedDateTime:String,
    purchasedCounts: {
        type:Number,
        default:0,
    },
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

const DApp = mongoose.model('dApps', dAppSchema);
export default DApp;

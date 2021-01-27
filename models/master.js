const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const masterSchema = new Schema({
    mnemonic: String,
    hdwallet: Object,
    masterPrivateKey:String,
    walletCount: String,
    orderCount:String,
    testCount:String,
    testOrderCount:String,
    airDropUsersCount:{
        type:Number,
        default:0
    }
});

// ! DON'T UNCOMMENT
// masterSchema.set('toObject', { virtuals: true });
// const Master = mongoose.model('master', masterSchema);
// module.exports = mongoose.model('Master', masterSchema);

const Master = mongoose.model('masters', masterSchema);

export default Master;

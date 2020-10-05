const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const masterSchema = new Schema({
    mnemonic: String,
    hdwallet: Object,
    masterPrivateKey:String,
    walletCount: String,
});


masterSchema.set('toObject', { virtuals: true });
const Master = mongoose.model('master', masterSchema);

module.exports = mongoose.model('Master', masterSchema);


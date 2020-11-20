const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var kycSchema = new Schema({
    mobile: String,
    birthDate: String,
    nationality: String,
    country: String,
    postalCode: String,
    city: String,
    street: String,
    building:String,
    kycStatus: String
});

// ! DON'T UNCOMMENT
// module.exports = mongoose.model('Kyc', kycSchema);

const Kyc = mongoose.model('kyc', kycSchema);
export default Kyc;

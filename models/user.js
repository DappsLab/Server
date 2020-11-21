const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: String,
    userName: {
        type:String,
        unique: true
    },
    email: String,
    password: String,
    confirmed: {
        type: Boolean,
        default:false
    },
    resetPasswordToken: String,
    emailConfirmToken: String,
    avatar: {
        type: String,
        default: "http://localhost:4000/user.png"
    },
    address: String,
    balance: String,
    location: String,
    twoFactorEnabled: {
        type: Boolean,
        default:false
    },
    twoFactorSecret:String,
    twoFactorCode: String,
    type: {
        type: String,
        default: "USER",
    },
    kyc: {
        mobile: String,
        birthDate: String,// !
        nationality: String,
        country: String,
        postalCode: String,
        city: String,
        street: String,// !
        building:String,
        kycStatus: {
            type: String,
            default: "NOT_SUBMITTED"
        }
    },
    testAddress: [{address: String, balance: String, password: String}],
    wallet: {
        privateKey: String,
        publicKey: String,
    },
    smartContracts: [{
        type: Schema.Types.ObjectId,
        ref: 'smartcontracts',
    }],
    purchasedContracts: [{
        type: Schema.Types.ObjectId,
        ref: 'purchasedcontracts',
    }],
    testedContracts: [{
        type: Schema.Types.ObjectId,
        ref: 'testedcontracts',
    }],
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'orders',
    }],
}, {
    timestamps: true
});



// const User = mongoose.model('users', userSchema);

const User = mongoose.model('users', userSchema);
export default User;


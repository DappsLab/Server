const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: String,
    userName: {
        type: String,
        unique: true
    },
    email: String,
    password: String,
    confirmed: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    isBlocked: {
        type: Boolean,
        default: false
    },
    emailConfirmToken: String,
    avatar: {
        type: String,
        default: "http://localhost:4000/user.png"
    },
    address: String,
    balance: {
        type: String,
        default: ""
    },
    location: String,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: {
        type: String,
        default: ""
    },
    twoFactorCode: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: "USER",
    },
    kyc: {
        mobile: {
            type: String,
            default: ""
        },
        birthDate: {
            type: String,
            default: ""
        },// !
        nationality: {
            type: String,
            default: ""
        },
        country: {
            type: String,
            default: ""
        },
        postalCode: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        street: {
            type: String,
            default: ""
        },// !
        building: {
            type: String,
            default: ""
        },
        kycStatus: {
            type: String,
            default: "NOT_SUBMITTED"
        }
    },
    testAddress: [{
        address: String,
        balance: String,
        wallet: {
            privateKey: String,
            publicKey: String,
        },
    }],
    wallet: {
        privateKey: String,
        publicKey: String,
    },
    smartContracts: [{
        type: Schema.Types.ObjectId,
        ref: 'smartcontracts',
    }],
    dApps: [{
        type: Schema.Types.ObjectId,
        ref: 'dApps',
    }],
    purchasedContracts: [{
        type: Schema.Types.ObjectId,
        ref: 'purchasedcontracts',
    }],
    testPurchasedContracts: [{
        type: Schema.Types.ObjectId,
        ref: 'testpurchasedcontracts',
    }],
    purchasedDApps: [{
        type: Schema.Types.ObjectId,
        ref: 'purchaseddApps',
    }],
    testedContracts: [{
        type: Schema.Types.ObjectId,
        ref: 'testedcontracts',
    }],
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'orders',
    }],
    testOrders: [{
        type: Schema.Types.ObjectId,
        ref: 'testorders',
    }],
    customOrders: [{
        type: Schema.Types.ObjectId,
        ref: 'customorders',
    }],
}, {
    timestamps: true
});


// const User = mongoose.model('users', userSchema);

const User = mongoose.model('users', userSchema);
export default User;


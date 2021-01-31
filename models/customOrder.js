const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customOrderSchema = new Schema({
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    role:String,
    businessName:String,
    businessWebsite:String,
    businessPhone:String,
    businessEmail:String,
    productType:String,
    requirements:String,
    status:String,
}, {
    timestamps: true
});


const CustomOrder = mongoose.model('customorders', customOrderSchema);

export default CustomOrder;

import {issueConfirmEmailToken} from "../helpers/Userfunctions";
const User = require('../models/user');

const emailConfirmationUrl=async(user)=>{
    const token = await issueConfirmEmailToken(user);
    await User.findByIdAndUpdate(user.id,{$set:{emailConfirmToken:token}},{new: true});
    return `http://localhost:3000/user/confirm/${token}`;
}


module.exports={emailConfirmationUrl}
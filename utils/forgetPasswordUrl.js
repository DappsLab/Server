import {issueConfirmEmailToken} from "../serializers";
const {User} = require('../models');

const forgetPasswordUrl=async(user)=>{
    const token = await issueConfirmEmailToken(user);
    await User.findByIdAndUpdate(user.id,{$set:{resetPasswordToken:token}},{new: true});
    return `http://localhost:3000/user/reset-password/${token}`;
}


module.exports={forgetPasswordUrl}

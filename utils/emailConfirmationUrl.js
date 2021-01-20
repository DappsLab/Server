import {issueConfirmEmailToken} from "../serializers";
const {User} = require('../models');

const emailConfirmationUrl=async(user)=>{
    const token = await issueConfirmEmailToken(user);
    await User.findByIdAndUpdate(user.id,{$set:{emailConfirmToken:token}},{new: true});
    return `http://localhost:3000/user/confirm/${token}`;
}
const emailConfirmationBody = async(name)=> {
    return `<div style="width: 574px;
\tmargin: 0 auto;
\tpadding: 50px;
\tbackground:#b2bec3;
\ttransform: translateY(74px)">
\t\t<div style="background: #fff;
\t\tpadding: 32px;
\t\twidth: 482px;
\t\theight:100%;
\t\tmargin: 0 auto"
\t\t>
\t\t\t<h4 style="text-align: center;
\t\t\tbackground-color: #1D1B45;
\t\t\tcolor: #fff;
\t\t\tpadding: 20px;"
\t\t\t>Welcome to DappsLab</h4>
\t\t\t<h2 style="margin:3em 0 0 0 ">Hey ${name},</h2>
\t\t\t<h5 style="margin:10px 0 30px 0">Wowwee! Thanks for registering an account with DappsLab! You're the coolest person in all the\tland and I've met alot of really cool people.Before we get started, we'll need to verify\tyour email.</h5>
\t\t\t<button   style="border: 2px solid #5754AB;
\t\t\tmargin:0 auto;
\t\t\tdisplay:block;
\t\t\tpadding: 10px 20px;
\t\t\tborder-radius:20px;
\t\t\tbackground: #5754AB;
\t\t\tcolor: #fff;
\t\t\tcursor: pointer;
\t\t\t">Verify Email</button>
\t\t</div>
\t</div>`
}


module.exports={emailConfirmationUrl, emailConfirmationBody}

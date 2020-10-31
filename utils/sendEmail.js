import {GMAIL_USER,GMAIL_PASSWORD} from "../config"
import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(email,link) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service:'gmail',
        // host: "smtp.ethereal.email",
        // port: 587,
        // secure: false, // true for 465, false for other ports
        auth: {
            user: GMAIL_USER , // generated ethereal user
            pass: GMAIL_PASSWORD, // generated ethereal password
        },
    });

    const mailOptions = {
        from: '"DappsLab 👻" <DappsLab@example.com>',
        to: email,
        subject: "DappsLab Email Confirmation",
        text: link,
        html: `<b>confirm your account:</br><a href="${link}">click here</a></b>`,
    }
    // send mail with defined transport object
    await transporter.sendMail(mailOptions,(err,data)=>{
        if(err){
            console.log("error:",err);
            return false;
        }else{
            console.log("email sent successfully");
            console.log("Message sent: %s", data.messageId);
            return true;
        }
    });

}

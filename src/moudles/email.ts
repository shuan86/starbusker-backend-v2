// import nodemailer from 'nodemailer';
import nodemailer from 'nodemailer';
import { envSetup } from "../envSetup";
import * as dotenv from 'dotenv'
dotenv.config({ path: envSetup() })
const mailTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_PASSWORD
    }
});


export const sendEmail = (toAccount: string, subject: string, html: string) => {
    const data = {
        from: `Fred Foo <${process.env.GMAIL_ACCOUNT}>`,
        to: toAccount,
        subject: subject,
        html: html,
    }
    mailTransport.sendMail(
        data,
        function (err) {
            if (err) {
                console.log('Unable to send email: ' + err);
            }
        },
    );

    console.log('send :', process.env.GMAIL_ACCOUNT, process.env.GMAIL_PASSWORD);
    console.log('sendEmail data :', data);

}


"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
// import nodemailer from 'nodemailer';
const nodemailer_1 = __importDefault(require("nodemailer"));
const envSetup_1 = require("../envSetup");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: envSetup_1.envSetup() });
const mailTransport = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_PASSWORD
    }
});
const sendEmail = (toAccount, subject, html) => {
    const data = {
        from: `Fred Foo <${process.env.GMAIL_ACCOUNT}>`,
        to: toAccount,
        subject: subject,
        html: html,
    };
    mailTransport.sendMail(data, function (err) {
        if (err) {
            console.log('Unable to send email: ' + err);
        }
    });
    console.log('send :', process.env.GMAIL_ACCOUNT, process.env.GMAIL_PASSWORD);
    console.log('sendEmail data :', data);
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map
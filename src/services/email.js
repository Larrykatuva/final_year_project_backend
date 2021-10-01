import  nodemailer from "nodemailer";
require('dotenv').config();


/**
 * Function to send activation emails
 * @param {string} email
 * @returns {boolean} true or false
 */
export const sendActivationMail = async(receipientEmail, ur) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const info = await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: receipientEmail,
            subject: "Account activation",
            text: "please use the given link to activate your account",
            html: `
                <h2>Please click on given link to activate account</h2>
                <p>${ur.href}</p>`
        });
        return info ? true : false
    } catch (error) {
        return false
    }
}


/**
 * Function to send reset password link
 * @param {string} email
 * @returns {boolean} true or false
 */
export const sendResetPasswordEmail = async(receipientEmail, ur) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        const info = await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: receipientEmail,
            subject: "Account activation",
            text: "please use the given link to reset your account password",
            html: `
                <h2>Please click on given link to reset yout account password</h2>
                <p>${ur.href}</p>`
        });
        return info ? true : false
    } catch (error) {
        return false
    }
}

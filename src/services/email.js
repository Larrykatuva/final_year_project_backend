const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config();


/**
 * Function to send activation emails
 * @param {string} email
 * @returns {boolean} true or false
 */
const sendActivationMail = async(receipientEmail, ur) => {
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

module.exports = {
    sendActivationMail
}
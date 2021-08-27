const dotenv = require('dotenv').config();
const User = require("../sequelize/models").User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');


/**
 * Queries user by email
 * @param {string} email 
 * @returns user object
 */
const checkIfUserEmailExists = async(email) => {
    const user = await User.findOne({ where: { email: email } })
    return user;
}

/**
 * 
 * @param {object} data 
 * @returns {object} object of new registered user
 */
const registerUser = async(data) => {
    const {username, email, password, country, county, phone, imageUrl, dateOfBirth} = data;
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);
    return await User.create(
        {
            username, 
            email, 
            country, 
            county, 
            password:hashPassword,
            phone, 
            imageUrl: imageUrl? imageUrl: "",
            role: "user", 
            age:dateOfBirth,
            is_active:false,
            is_verified:false
        })
}


/**
 * Login user
 * @param {Object} userData 
 * @returns boolean: if logged in or not
 */
const loginUser = async(user, password) => {
    const response = user && bcrypt.compareSync(password, user.password);
    return response ? true : false;
}



/**
 * Generates an accessToken
 * @param {number} userId 
 * @returns {string} accessToken
 */
const generateAccessToken = async(userId) => {
    const accessToken =
        'Bearer ' +
        (await jwt.sign({ user: userId },
            process.env.PRIVATE_KEY
        ));
    return accessToken;
}



module.exports = {
    registerUser,
    checkIfUserEmailExists,
    loginUser,
    generateAccessToken
}
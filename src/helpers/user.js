require('dotenv').config();
const User = require("../sequelize/models").User;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


/**
 * Queries user by email
 * @param {string} email 
 * @returns user object
 */
export const checkIfUserEmailExists = async(email) => {
    const user = await User.findOne({ where: { email: email } })
    return user;
}

/**
 * 
 * @param {object} data 
 * @returns {object} object of new registered user
 */
export const registerUser = async(data) => {
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
            imageUrl: imageUrl,
            role: "user", 
            age:dateOfBirth,
            is_active:false,
            is_verified:false
        })
}


/**
 * Login user
 * @param {Object} userData 
 * @returns {boolean} if logged in or not
 */
export const loginUser = async(user, password) => {
    const response = user && bcrypt.compareSync(password, user.password);
    return response ? true : false;
}



/**
 * Generates an accessToken
 * @param {number} userId 
 * @returns {string} accessToken
 */
export const generateAccessToken = async(userId) => {
    const accessToken =
        'Bearer ' +
        (await jwt.sign({ user: userId },
            process.env.PRIVATE_KEY
        ));
    return accessToken;
}



/**
 * Activating user account by Id
 * @param {number} userId 
 * @returns {boolean} true is account is activated and false otherwise
 */
export const activateUserEmail = async(userId) => {
    return User.update({is_active: true, is_verified: true},{
        where: {
            id: userId
        }
    })
}


/**
 * Deactivating user account by Id
 * @param {number} userId 
 * @returns {boolean} true is account is deactivated and false otherwise
 */
export const deactivateUserAccount = async(userId) => {
    return User.update({is_active: false},{
        where: {
            id: userId
        }
    })
}


/**
 * Check user by Id
 * @param {number} userId 
 * @returns {object} object of the user matching the email
 */
export const checkUserById = async (userId) => {
    return User.findOne({where: {id: userId}})
}


/**
 * Updating user password matching the passed email
 * @param {string} email 
 * @param {string} password 
 * @returns {object} user details of the updated user
 */
export const updateUserPassword = async (email, password) => {
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);
    return await User.update({password: hashPassword}, {
        where: {
            email,
        }
    })
}

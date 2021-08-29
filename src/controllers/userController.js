const createError = require('http-errors');
const handleAuthErrors = require('../errors/auth')
const { 
    checkIfUserEmailExists,
    registerUser,
    loginUser,
    generateAccessToken,
    activateUserEmail,
    deactivateUserAccount,
    updateUserPassword
} = require('../helpers/user')
const {
    sendActivationMail,
    sendResetPasswordEmail
} = require('../services/email')
class UserController{
    /**
   * Sign up a new user
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @returns {Object} Data for new user
   */
   static async registerNewUser(req,res,next){
       const {
           body: {username, email, password, country, county, dateOfBirth, phone, imageUrl}
       } = req
       const host = 'https/nccg'//req.headers.origin
       if(!username, !email, !password, !country, !country, !county, !dateOfBirth, !phone){
            return res
                .status(400)
                .send(handleAuthErrors('AUR_08', 400, 'fields'))
       }
        try {
            const exixts = await checkIfUserEmailExists(email)
            if(exixts){
                return res
                    .status(400)
                    .send(handleAuthErrors('AUR_09', 400, 'email'))
            }
            const newUser = await  registerUser({username, email, password, country, county, dateOfBirth, phone, imageUrl})
            if(newUser){
                // const activateUrl = new URL(`${host}/activate/${newUser.id}`);
                const send = await sendActivationMail(email, `${host}/activate/${newUser.id}`)
                if(send){
                    return res
                        .status(200)
                        .send({
                            error: false,
                            message: "User added successfully",
                            newUser
                        });
                }else{
                    return res
                        .status(400)
                        .send({
                            error: true,
                            message: "An error occured",
                    });
                }
            }else{
                return res
                    .status(400)
                    .send({
                        error: true,
                        message: "An error occured",
                });
            }
        } catch (error) {
           next({
                data: createError(
                    error.status,
                    error.message
                )
            }); 
        }
    }


    /**
   * Login user with email and password
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @returns {Object} Data for new user
   */
    static async signInUser(req, res, next){
        const {
            body: {email, password}
        } = req
        if(!email, !password){
            return res
                .status(400)
                .send(handleAuthErrors('AUR_08', 400, 'fields'))
       }
        try {
           const exists = await checkIfUserEmailExists(email)
            if(!exists){
                return res
                    .status(400)
                    .send(handleAuthErrors('AUR_10', 400, 'email'))
            } 
            if(!exists.is_verified){
                return res
                    .status(400)
                    .send(handleAuthErrors('AUR_02', 400, 'email'))
            }
            if(!exists.is_active){
                return res
                    .status(400)
                    .send(handleAuthErrors('AUR_12', 400, 'account'))
            }
            if(await loginUser(exists, password)){
                return res
                    .status(200)
                    .send({
                            error: false,
                            user: exists,
                            message: "User logged in successfully",
                            accessToken: await generateAccessToken(exists.id),
                            expiry: "1h"
                    })
            }else{
                return res
                    .status(401)
                    .send({
                            error: true,
                            message: "Invalid login details",
                    })
            }
        } catch (error) {
            next({
                data: createError(
                    error.status,
                    error.message
                )
            }); 
        }
    }


    /**
   * Activate newly registered user by thier id
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @returns {Object} Data for new user
   */
    static async emailAvtivateUser(req, res, next){
        const{ params: {userId}} = req
        if(!userId){
            return res
                .status(400)
                .send(handleAuthErrors('AUR_11', 400, 'UserId'))
        }
        try {
            const activation = await activateUserEmail(userId)
            if(activation){
                return res
                    .status(200)
                    .send({
                            error: false,
                            message: "User account activated successfully",
                    })
            }else{
                return res
                    .status(400)
                    .send({
                            error: true,
                            message: "Account activation failed",
                    })
            }
        } catch (error) {
            next({
                data: createError(
                    error.status,
                    error.message
                )
            }); 
        }
    }



    /**
   * Deactivate already active user by thier id
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @returns {Object} Data for new user
   */
    static async userAccountDeactivation(req, res, next){
        const{ params: {userId}} = req
        if(!userId){
            return res
                .status(400)
                .send(handleAuthErrors('AUR_11', 400, 'UserId'))
        }
        try {
            const activation = await deactivateUserAccount(userId)
            if(activation){
                return res
                    .status(200)
                    .send({
                            error: false,
                            message: "User account deactivated successfully",
                    })
            }else{
                return res
                    .status(400)
                    .send({
                            error: true,
                            message: "Account deactivation failed",
                    })
            }
        } catch (error) {
            next({
                data: createError(
                    error.status,
                    error.message
                )
            }); 
        }
    }


     /**
   * Send password reset email
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @returns {Object} message
   */
    static async requestResetPasswordLink(req, res, next){
        const {body: {email}} = req
        const host = 'https/nccg'//req.headers.origin
        if(!email){
            return res
                .status(400)
                .send(handleAuthErrors('AUR_13', 400, 'email'))
       }
        try {
            const exists = await checkIfUserEmailExists(email)
            if(!exists){
                return res
                    .status(400)
                    .send(handleAuthErrors('AUR_10', 400, 'email'))
            } 
            const send = await sendResetPasswordEmail(email, `${host}/reset-pass/${email}`)
            if(send){
                return res
                    .status(200)
                    .send({
                            error: false,
                            message: "Reset password link send, check email",
                    })
            }else{
                return res
                    .status(400)
                    .send({
                            error: true,
                            message: "An error occured while trying to send reset email",
                    })
            }
        } catch (error) {
            next({
                data: createError(
                    error.status,
                    error.message
                )
            }); 
        }
    }



    /**
   * Update user password
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @returns {Object} message of updated user details
   */
    static async setNewPassword(req, res, next){
        const {
            body: {email, password}
        } = req
        if(!email, !password){
            return res
                .status(400)
                .send(handleAuthErrors('AUR_08', 400, 'fields'))
       }
       try {
           const exists = await checkIfUserEmailExists(email)
            if(!exists){
                return res
                    .status(400)
                    .send(handleAuthErrors('AUR_10', 400, 'email'))
            } 
            const updated = await updateUserPassword(email, password)
            if(!updated){
                return res
                    .status(400)
                    .send({
                            error: true,
                            message: "An error occured while trying to update password",
                    })
            }
            return res
                .status(200)
                .send({
                        error: false,
                        message: "Password reset successfully"
                })
           
       } catch (error) {
            next({
                data: createError(
                    error.status,
                    error.message
                )
            }); 
       }
    }

}

module.exports = UserController;
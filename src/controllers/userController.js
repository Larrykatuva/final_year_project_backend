const createError = require('http-errors');
const handleAuthErrors = require('../errors/auth')
const { 
    checkIfUserEmailExists,
    registerUser,
    loginUser,
    generateAccessToken    
} = require('../helpers/user')
const {
    sendActivationMail
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
       const host = req.headers.origin
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
            const newUser = registerUser({username, email, password, country, county, dateOfBirth, phone, imageUrl})
            if(newUser){
                const activateUrl = new URL(`${host}/activate/${newUser.id}`);
                const send = await sendActivationMail(email, activateUrl)
                if(send){
                    return res
                        .status(200)
                        .send({
                            error: false,
                            message: "Role updated successfully",
                            newUser
                        });
                }
                return res
                    .status(200)
                    .send({
                        error: false,
                        message: "Role updated successfully",
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
            return res.send("Hi")
        } catch (error) {
           next({
                data: createError(
                    error.status,
                    error.message
                )
            }); 
        }
    }


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
           const exixts = await checkIfUserEmailExists(email)
            if(!exixts){
                return res
                    .status(400)
                    .send(handleAuthErrors('AUR_10', 400, 'email'))
            } 
            if(await loginUser(exixts, password)){
                return res
                    .status(200)
                    .send({
                            error: false,
                            user: exixts,
                            message: "User logged in successfully",
                            accessToken: await generateAccessToken(exixts.id),
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
}

module.exports = UserController;
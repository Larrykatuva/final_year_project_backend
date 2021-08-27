const createError = require('http-errors');

class UserController{
    /**
   * Sign up a new customer
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @returns {Object} Data for new user
   */
   static async registerNewUser(req,res,next){
        try {
            return res.send("Hello")
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
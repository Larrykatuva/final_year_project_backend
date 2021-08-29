const jwt = require('jsonwebtoken');
const handleAuthErrors = require('../errors/auth');
const dotenv = require('dotenv').config();

const authentication = async (req, res, next) => {
    const secretKey = await process.env.PRIVATE_KEY;
    const bearerHeader = await req.headers['authorization'];

    if(bearerHeader){
        if(typeof bearerHeader !== 'undefined'){
            const bearer = bearerHeader.split(' ');
            const token = bearer[1];
            try {
                 jwt.verify(token, secretKey, (error, user) => {
                if (error){
                    if(error.name === "TokenExpiredError"){
                        return res
                            .status(401)
                            .send(handleAuthErrors("AUR_05", 401, "token"))
                    }

                    return res
                        .status(401)
                        .send(handleAuthErrors("AUR_01", 401, "token"))
                }else{
                    req.user = user
                    next();
                }
            });   
            } catch (error) {
                console.log(error)
            }
        }else{
            return res
                .status(401)
                .send(handleAuthErrors('AUR_01', 401, 'Token'));
        }
    }else{
        return res
                .status(401)
                .send(handleAuthErrors('AUR_04', 401, 'NoAuth'));
    }
}

module.exports = authentication;
const {sign, verify} = require('jsonwebtoken');
require('dotenv').config();

// Create JWT Token
const createToken = async (user) => {
    
    const accessToken = sign(
        {
            user_id: user.rows[0].user_id
        },
        // inhaler_id: user.rows[0].inhaler_id,
        // email: user.rows[0].email,
        // password: user.rows[0].password,
        // dob: user.rows[0].dob},
        process.env.JWT_KEY, {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );
    // console.log(accessToken);
    // console.log(process.env.JWT_KEY);
    return accessToken
}

// Verify token
const validateToken = async (req, res, next) => {

    const accessToken = req.headers.accesstoken;
   // const cookie = accessToken[1];

    if (!accessToken){
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        console.log('Access Token:', accessToken)
        const validToken = await verify(accessToken, process.env.JWT_KEY);
        if (validToken) {
            req.authenticated = true;
            return next();
        } 
    } catch (error){
        console.log(error);
        return res.status(401).json({ message: error.message });
    }

}

module.exports = {
    createToken,
    validateToken
};
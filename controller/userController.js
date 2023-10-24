const pool = require('../database/database');
const queries = require('./query');
const bcrypt = require('bcrypt');
const jwt_decode = require('jwt-decode');
const { createToken, validateToken } = require('../jwt/jwt');
const saltRounds = 10;

const userRegister = async (req, res) => {
   
    try {
        const { email, password, dob, confirmPassword } = req.body
        const hash = await bcrypt.hash(password, saltRounds);

        // check if email exists
        const result = await pool.query(queries.checkEmailExists, [email]);
        if(result.rows.length) {
            res.status(400).json({ error: 'Email already registered' });
        } else if (password !== confirmPassword) { // check if password not equal with confirm password
            res.status(400).json({ error: 'Not match password'});
        } else {
            await pool.query(queries.addUserData, [email, hash, dob]);
            res.status(201).json({ message: 'User registered' });
        }
    } catch(error) {
        console.log(error);
        if (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

const userLogin = async (req, res) => {

    try {
        const { email, password } = req.body
        console.log(email, password)

        const user = await pool.query(queries.getUserDataByEmail, [email])
        if(!user.rows.length) { 
            return res.status(400).json({
                 error: "User doesn't exists",
                 accessToken: null
                });
        }

        // check if req password and db password match
        const dbPassword = user.rows[0].password;
        const match = await bcrypt.compare(password, dbPassword);
        if(!match) {
           return res.status(400).json({ 
                message: 'Invalid username or password',
                accessToken: null
            });
        } else {
            console.log("creating token")
            const accessToken = await createToken(user);

            console.log(accessToken);

            res.cookie("access-token", accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 20,
                httpOnly: true
            });
    
            res.json({
               message: accessToken
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const addInhalertoUser = async (req, res) => {
    try {

        const token = req.headers.accesstoken;
        const { inhaler_id }  = req.body;

        const decoded = jwt_decode(token);
        const user_id = decoded.user_id
        console.log(user_id);

        const user = await pool.query(queries.getUserById, [user_id]);
        if(!user.rows.length){
            return res.status(400).json({
                error: "User doesn't exists",
                //accessToken: null
               });
        }
    
        await pool.query(queries.updateInhalerToUser, [ user_id, inhaler_id ]);
        res.status(200).json({
            message: 'Updated inhaler to user',
            result: inhaler_id
        });
    
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message })
    }
}

const getUserDataById = async (req, res) => {
    try{
        const user_id = req.params.user_id;
        const user = await pool.query(queries.getUserById, [user_id]);
        if(!user.rows.length){
            return res.status(400).json({
                error: "User doesn't exists",
                accessToken: null
               });
        }
        res.status(200).json({ result: user.rows})
    } catch (error){
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getAllUserData = async (req, res) => {

    try {
        const result = await pool.query(queries.getAllUserData);
        res.status(200).json({
            result: result.rows
        });
    }catch (error) {
        console.log(error)
        res.status(500).json({ message : error.message });
    }

}

const mockTest = (req, res) => {
    res.json(["profile"]);
}

module.exports = {
    userRegister,
    getAllUserData,
    userLogin,
    mockTest,
    addInhalertoUser,
    getUserDataById
}
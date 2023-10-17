const pool = require('../database/database');
const queries = require('./query');
const bcrypt = require('bcrypt');
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

        const user = await pool.query(queries.getUserDataByEmail, [email])
        if(!user.rows.length) { 
            return res.status(400).json({ error: "User doesn't exists"});
        }

        // check if req password and db password match
        const dbPassword = user.rows[0].password;
        const match = await bcrypt.compare(password, dbPassword);
        if(!match) {
           return res.status(400).json({ error: 'Invalid username or password'});
        } else {
            console.log("creating token")
            const accessToken = await createToken(user);

            console.log(accessToken);

            res.cookie("access-token", accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 20,
                httpOnly: true
            });
    
            res.json({
               message: 'User logged in',
               accessToken: accessToken
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

const getAllUserData = async (req, res) => {

    try {
        const result = await pool.query(queries.getAllUserData);

        res.status(200).json(result.rows);
    }catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }

}

const mockTest = (req, res) => {
    res.json("profile");
}

module.exports = {
    userRegister,
    getAllUserData,
    userLogin,
    mockTest,
}
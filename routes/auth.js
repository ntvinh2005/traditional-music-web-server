const express = require('express');
const router = express.Router()
const argon2 = require('argon2')
const jsonwebtoken = require('jsonwebtoken')

const User = require('../models/User')
const verifyToken = require('../middleware/auth')

router.get('/', verifyToken, async(req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if (!user) return res.status(400).json({success: false, message: 'User not found'})
        res.json({success: true, user})
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error'})
    }
})

// @route POST api/auth/register
// @desc Register a new user
// @access public
router.post('/register', async(req, res) => {
    const username = req.body.username
    const password = req.body.password

    //Validation for missing username or password 
    if (!username||!password) return res.status(400).json({success: false, message: "Missing username or password"})

    try {
        //Check for existing user
        const user = await User.findOne({username: username})
        if (user) return res.status(400).json({success: false, message: "Username has already been taken"})

        //good confirm, hash password using argon2
        const hashedPassword = await argon2.hash(password)

        const newUser = new User({
            username: username, 
            password: hashedPassword,
            score: 10,
        })
        await newUser.save()

        //return Token
        const accessToken = jsonwebtoken.sign({userId: newUser._id}, 'vinh12345')
        res.status(200).json({success: true, message: "Create account successfully!", accessToken})
    } catch(error) {
        console.log(error)
        res.status(500).json({success: false, message: "Internal error"})
    }
})

// @route POST api/auth/login
// @desc Login
// @access Public
router.post('/login', async(req, res) => {
    const {username, password} = req.body

    //Simple validation
    if (!username||!password) return res.status(400).json({success: false, message: "Missing username or password"})

    try {
        //Check for existing user
        const user = await User.findOne({username})
        if (!user) return res.status(400).json({success: false, message: "Incorrect username!"})

        //Username found, check for password
        const passwordValid = await argon2.verify(user.password, password)
        if (!passwordValid) return res.status(400).json({success: false, message: "Incorrect password!"})

        //Good confirmed, return Token
        const accessToken = jsonwebtoken.sign({userId: user._id}, 'vinh12345')
        res.status(200).json({success: true, message: 'Logged in successfully!', accessToken, user})
    } catch (error) {
        res.status(500).json({success: false, message: "Internal Server Error"})
        console.log(error)
    }
})

// @route PUT api/route
// @desc Update Auth
// @access Private
router.put('/update/:id', verifyToken, async (req, res) => {
	const { username, score } = req.body

    try {
        let updatedAuth = {
            username,
            score,
        }

        const authUpdateCondition = {_id: req.params.id, user: req.userId}

        updatedAuth = await User.findOneAndUpdate(authUpdateCondition, updatedAuth, {new: true})

        // Not authorizeed to update post

        if (!updatedAuth)
        return res.status(401).json({success: false, message: 'User not found or not authorised'})

        res.json({success: true, message: 'Congratuation!', user: updatedAuth})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}
)

module.exports = router
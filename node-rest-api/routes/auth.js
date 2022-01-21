const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
//REGISTER
router.post('/register', async (req, res) => {
	try {
		//Generate a hashed password
		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash(req.body.password, salt)
		//Create new User``
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		})
		const user = await newUser.save()
		res.status(200).json(user)
	} catch (err) {
		res.status(500).json('error')
	}
})

//LOGIN
router.post('/login', async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email })
		!user && res.status(404).json('No user found!')

		const validPassword = await bcrypt.compare(req.body.password, user.password)
		!validPassword && res.status(400).json('That password was incorrect')

		res.status(200).json(user)
	} catch (err) {
		res.status(500).json('error')
	}
})
module.exports = router

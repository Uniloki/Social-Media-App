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
		if (!user) {
			res
				.status(401)
				.json('Please make sure both your email and password are correct')
			return
		}

		const validPassword = await bcrypt.compare(req.body.password, user.password)
		if (!validPassword) {
			res
				.status(403)
				.json('Please make sure both your email and password are correct')
			return
		}

		res.status(200).json(user)
	} catch (err) {
		res.status(500).json(err)
	}
})
module.exports = router

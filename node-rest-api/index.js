const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth')
const postRoute = require('./routes/post')
const commentRoute = require('./routes/comment')
const conversationsRoute = require('./routes/conversations')
const messagesRoute = require('./routes/messages')
const multer = require('multer')
const path = require('path')
require('dotenv').config()

mongoose.connect(
	'mongodb+srv://uniloki:Nawood0913!@cluster0.gaml9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
	{ useNewUrlParser: true },
	() => {
		console.log('connected to mongo')
	}
)

app.use('/images', express.static(path.join(__dirname, 'public/images')))

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images')
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name)
	},
})

const upload = multer({ storage: storage })
app.post('/api/upload', upload.single('file'), (req, res) => {
	try {
		return res.status(200).json('File uploded successfully')
	} catch (error) {
		console.error(error)
	}
})

app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/comments', commentRoute)
app.use('/api/conversations', conversationsRoute)
app.use('/api/messages', messagesRoute)

app.get('/', (req, res) => {
	res.send('Welcome to homepage')
})

app.listen(3001, () => {
	console.log('Backend server is running')
})

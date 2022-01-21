const router = require('express').Router()
const User = require('../models/user')
const Post = require('../models/Post')
const Comment = require('../models/Comment')

router.post('/', async (req, res) => {
	const newComment = new Comment(req.body)
	try {
		const savedComment = await newComment.save()
		res.status(200).json(savedComment)
	} catch (err) {
		res.status(500).json(err)
	}
})

router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findOne({ _id: req.params.id })
		const comments = await Comment.find({ postId: post._id })
		res.status(200).json(comments)
	} catch (err) {
		res.status(500).json(err)
	}
})

module.exports = router

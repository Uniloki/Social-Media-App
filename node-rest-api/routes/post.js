const router = require('express').Router()
const User = require('../models/user')
const Post = require('../models/Post')

router.post('/', async (req, res) => {
	const newPost = new Post(req.body)
	try {
		const savedPost = await newPost.save()
		res.status(200).json(savedPost)
	} catch (err) {
		res.status(500).json(err)
	}
})

router.put('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		console.log(post.userId === req.body.userId)
		if (post.userId === req.body.userId) {
			await post.updateOne({ $set: req.body })
			res.status(200).json('Your post has been updated')
		} else {
			res.status(403).json('You can only update your post')
		}
	} catch (err) {
		res.status(500).json(err)
	}
})

router.delete('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		console.log(post.userId === req.body.userId)
		console.log(req.body.userId)
		if (post.userId === req.body.userId) {
			await post.deleteOne()
			res.status(200).json('Your post has been deleted')
		} else {
			res.status(403).json('You can only delete your post')
		}
	} catch (err) {
		res.status(500).json(err)
	}
})

router.put('/:id/like', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } })
			res.status(200).json('This post has been liked!')
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } })
			res.status(200).json('This post has been disliked')
		}
	} catch (err) {
		res.status(500).json(err)
	}
})

router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id)
		res.status(200).json(post)
	} catch (err) {
		res.status(500).json(err)
	}
})

router.get('/timeline/:userId', async (req, res) => {
	try {
		const currentUser = await User.findById(req.params.userId)
		const userPosts = await Post.find({ userId: currentUser._id })
		const friendPosts = await Promise.all(
			currentUser.followings.map((friendId) => {
				return Post.find({ userId: friendId })
			})
		)
		res.status(200).json(userPosts.concat(...friendPosts))
	} catch (err) {
		res.status(500).json(err)
	}
})
//get users all post
router.get('/profile/:username', async (req, res) => {
	try {
		const user = await User.findOne({ username: req.params.username })
		const posts = await Post.find({ userId: user._id })
		res.status(200).json(posts)
	} catch (err) {
		res.status(500).json(err)
	}
})
module.exports = router

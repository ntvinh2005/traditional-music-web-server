const express = require('express');
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Post = require('../models/Post')

//@route GET api/posts
//@desc get course's posts
//@access private
router.get('/:id', verifyToken, async(req, res) => {
    try {
        const posts = await Post.find({course: req.params.id}).populate('course')
        res.json({success: true, posts})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

//@route GET api/posts
//@desc get post by id
//@access private
router.get('/get/:id', async(req, res) => {
    try {
        const posts = await Post.find({_id: req.params.id})
        res.json({success: true, posts})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

//@route GET api/posts/:id
//@decs 

// @route POST api/post
// @desc Create Post
// @access Private

router.post('/:id', verifyToken,  async(req, res) =>{
    const {title, content} = req.body
    console.log(!title)
    console.log(String(title))

    //Validation
    if (!title)
        return res.status(400).json({success: false, message: 'Title is required'})

    try {
        const newPost = new Post({
            title: title, 
            content: content,
            course: req.params.id,
            user: req.userId
        })
        await newPost.save()
        res.json({success: true, message: 'Add post successfully!', post: newPost})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error', post: newPost})
    }
})

// @route PUT api/route
// @desc Update post
// @access Private
router.put('/update/:id', verifyToken, async (req, res) => {
	const { title, content } = req.body

	// Simple validation
	if (!title)
		return res
			.status(400)
			.json({ success: false, message: 'Title is required' })

    try {
        let updatedPost = {
            title,
            content: content || '',
        }

        const postUpdateCondition = {_id: req.params.id, user: req.userId}

        updatedPost = await Post.findOneAndUpdate(postUpdateCondition, updatedPost, {new: true})

        // Not authorizeed to update post

        if (!updatedPost)
        return res.status(401).json({success: false, message: 'Post not found or not authorised'})

        res.json({success: true, message: 'Congratuation!', post: updatedPost})
    } catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
}
)

module.exports = router
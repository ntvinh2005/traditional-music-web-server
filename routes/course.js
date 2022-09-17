const express = require('express');
const router = express.Router()
const verifyToken = require('../middleware/auth')

const Course = require('../models/Course')

//@route GET api/courses/public
//@desc create new course
//@access public
router.get('/public/', async(req, res) => {
    try {
        const courses = await Course.find()
        res.json({success: true, courses})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

//@route GET api/posts
//@desc get own posts
//@access private
router.get('/', verifyToken, async(req, res) => {
    try {
        const courses = await Course.find({user: req.userId}).populate('user')
        res.json({success: true, courses})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

//@route GET api/course/:id
//@decs get course by id
//@access public
router.get('/:id', verifyToken, async(req, res) => {
    try {
        const courses = await Course.find({_id: req.params.id})
        res.json({success: true, courses})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

// @route POST api/post
// @desc Create Post
// @access Private

router.post('/', verifyToken,  async(req, res) =>{
    const {title, description, imgUrl} = req.body
    console.log(!title)
    console.log(String(title))

    //Validation
    if (!title)
        return res.status(400).json({success: false, message: 'Title is required'})

    try {
        const newCourse = new Course({
            title, 
            description,
            imgUrl,
            user: req.userId
        })
        await newCourse.save()
        res.json({success: true, message: 'Add course successfully!', course: newCourse})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

// @route PUT api/route
// @desc Update post
// @access Private
router.put('/update/:id', verifyToken, async (req, res) => {
	const { title, description } = req.body

	// Simple validation
	if (!title)
		return res
			.status(400)
			.json({ success: false, message: 'Title is required' })

    try {
        let updatedCourse = {
            title, 
            description,
            user: req.userId
        }

        const courseUpdateCondition = {_id: req.params.id, user: req.userId}

        updatedCourse = await Course.findOneAndUpdate(courseUpdateCondition, updatedCourse, {new: true})

        console.log("Yeah!!!")

        // Not authorizeed to update post

        if (!updatedCourse)
        return res.status(401).json({success: false, message: 'Course not found or not authorised'})

        res.json({success: true, message: 'Congratuation!', post: updatedPost})
    } catch (error) {
        console.log("No way")
        return res.status(500).json({success: false, message: 'Internal server error', error})
    }
}
)

module.exports = router
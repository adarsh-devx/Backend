const express = require('express')
const postRouter = express.Router()
const createPostController = require('../controllers/post.controller')
const multer = require('multer')
const upload = multer({storage: multer.memoryStorage()})




//POST /api/posts/
postRouter.post('/'  , upload.single('image') , createPostController)

module.exports = postRouter
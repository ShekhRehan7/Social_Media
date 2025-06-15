import express from'express'
import { commentPost, createPost,deletePost, getAllPost, likepost, yourPost } from '../controllers/postControllers.js'
import checkToken from '../middleware/checkToken.js'
const router = express.Router()

router.post('/create',checkToken,createPost)
router.delete('/deletePost/:postId',checkToken,deletePost) 
router.get('/yourPost',checkToken,yourPost) 
router.get('/getAllPost',getAllPost)
router.put('/likes/:postId',checkToken,likepost)
router.put('/comment/:postId',checkToken,commentPost)

export default router;

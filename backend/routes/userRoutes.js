import express from 'express'
import { deleteUser, followUnfollow, forgetPassword, getAllUser, getFirend, getLoggedInUser, getSearch, loginUser, registerUser, resetPassword, updatePassword, updateUser } from '../controllers/userControllers.js';
import checkToken from '../middleware/checkToken.js'
const router = express.Router();

router.post('/create',registerUser);
router.post('/login',loginUser);
router.get('/allUser',checkToken,getAllUser);
router.get('/loggedInUser',checkToken,getLoggedInUser)
router.put('/update',checkToken,updateUser);
router.delete('/delete',checkToken,deleteUser);
router.post('/forgetPassword',forgetPassword)
router.get('/resetPassword/:resetToken',resetPassword)
router.put('/updatePassword/:resetToken',updatePassword)
router.get('/searchFriends',checkToken,getSearch);
router.get('/friend/:friendId', checkToken, getFirend)
router.put('/followUnfollow/:friendId',checkToken,followUnfollow)


export default router
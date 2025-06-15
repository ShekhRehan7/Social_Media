import express from 'express';
import { deleteMessage, getMessage, sendMessage } from '../controllers/messageController.js';
import checkToken from '../middleware/checkToken.js';
const router = express.Router()


router.post('/create/:friendId', checkToken, sendMessage);
router.get('/getMessage/:friendId', checkToken , getMessage);
router.delete('/delete/:messageId',checkToken, deleteMessage);


export default router
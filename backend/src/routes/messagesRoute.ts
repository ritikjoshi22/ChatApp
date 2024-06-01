import { Router } from 'express';
import { addMessage, getAllMessages } from "../controllers/messagesController";

const router = Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getAllMessages);

export default router;
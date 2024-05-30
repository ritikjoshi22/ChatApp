import { Router } from 'express';
import { register, login, setAvatar } from '../controllers/usersController';

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);

export default router;
import register from '../controllers/usersController';
import { Router } from 'express';

const router = Router();

router.post("/register", register);

export default router;
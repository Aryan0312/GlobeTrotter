import {Router} from "express";
import { handleUserLogin} from "../controller/auth/authController";
const router = Router();

router.post("/login",handleUserLogin);

export default router;


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

import {Router} from "express";
import { handleUserLogin, handleUserSignup } from "../controller/auth/authController";
const router = Router();

router.post("/login", handleUserLogin);
router.post("/register", handleUserSignup);

export default router;


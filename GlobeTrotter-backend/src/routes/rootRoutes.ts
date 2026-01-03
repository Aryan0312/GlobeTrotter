import {Router} from "express";
import { allowedRole } from "../middleware/authMiddleware";
import { testController } from "../controller/test/testController";
const router = Router();

router.get("/",allowedRole(["USER","ADMIN"]),testController);

export default router
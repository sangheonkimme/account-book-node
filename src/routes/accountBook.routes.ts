import { Router } from "express";
import {
  getMyAccountBooks,
  createAccountBook,
} from "../controllers/accountBook.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getMyAccountBooks);
router.post("/", createAccountBook);

export default router;

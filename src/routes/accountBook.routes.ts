import { Router } from "express";
import {
  getMyAccountBooks,
  createAccountBook,
  updateAccountBook,
  deleteAccountBook,
  reorderAccountBooks,
} from "../controllers/accountBook.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getMyAccountBooks);
router.post("/", createAccountBook);
router.patch("/reorder", reorderAccountBooks);
router.put("/:id", updateAccountBook);
router.delete("/:id", deleteAccountBook);

export default router;

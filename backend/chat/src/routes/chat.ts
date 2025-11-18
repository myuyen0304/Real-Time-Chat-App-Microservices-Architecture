import express from "express";
import isAuth from "../middleware/isAuth.js";
import { createNewChat, getAllChats, getMessageByChat, sendMessage } from "../controller/chat.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/chat/new", isAuth, createNewChat);
router.get("/chat/all", isAuth, getAllChats);
router.post("/message", isAuth, upload.single("image"), sendMessage);
router.get("/message/:chatId", isAuth, getMessageByChat);

export default router;

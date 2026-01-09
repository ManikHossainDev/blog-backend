
import express, {  Router } from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";


const router = express.Router();

router.get('/author/:authorId', commentController.getCommentByAuthorId)

router.get("/:commentId", commentController.getCommentById)

router.post("/", auth(UserRole.ADMIN, UserRole.USER) , commentController.createComment);

router.delete("/:commentId", auth(UserRole.ADMIN, UserRole.USER) ,commentController.deleteCommentById)

export const commentRouter: Router = router;
import express, {  Router } from "express";
import { PostController } from "./post.controller";
import auth, { UserRole } from "../../middlewares/auth";
const router = express.Router();
router.get("/", PostController.getPosts);
router.post("/", auth( UserRole.USER, UserRole.ADMIN), PostController.createPost);
router.get("/:id", PostController.getPostById);
router.get("/my-posts", auth(UserRole.ADMIN, UserRole.USER), PostController.getMyPost)
export const postRouter: Router = router;

import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
  console.log(req.user);
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({
      error: "post creation failed",
      details: err,
    });
  }
};

const getPosts = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const isFeatureed = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    const posts = await postService.getAllPosts({
      search: searchString,
      tags,
      isFeatureed,
      status,
      authorId,
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve posts",
      details: err,
    });
  }
};

export const PostController = {
  createPost,
  getPosts,
};

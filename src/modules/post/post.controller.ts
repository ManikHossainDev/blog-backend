import { Request, Response } from "express";
import { postService } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { auth } from "../../lib/auth";

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

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);

    const posts = await postService.getAllPosts({
      search: searchString,
      tags,
      isFeatureed,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      error: "Failed to retrieve posts",
      details: err,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Post ID is required");
    }
    const post = await postService.getPostById(id);
    res.status(200).json(post);
  } catch (err) {
    res.status(400).json({
      error: "Failed to retrieve post",
      details: err,
    });
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if(!user){
      throw new Error("Your are unauthorized!")
    }
    const posts = await postService.getMyPosts(user.id as string);
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({
      error: "Post fetch failed",
      message: err instanceof Error ? err.message : err,
    });
  }
};

const updateMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Your are unauthorized!");
    }
    const {postId} = req.params;
    const posts = await postService.updateMyPost(postId as string, req.body, user.id);
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({
      error: "Post update failed",
      message: err instanceof Error ? err.message : "post update failed",
    });
  }
};


export const PostController = {
  createPost,
  getPosts,
  getPostById,
  getMyPosts,
  updateMyPosts,
};

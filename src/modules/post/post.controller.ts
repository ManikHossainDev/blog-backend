import { Result } from './../../../generated/prisma/internal/prismaNamespace';
import { Request, Response } from "express";
import { postService } from './post.service';
import { Post } from '../../../generated/prisma/client';

const createPost = async (req:Request, res:Response) => {
   try{
        const result = await postService.createPost(req.body)
        res.status(201).json(result)
   }catch(err){
     res.status(400).json({
       error: "post creation failed",
       details: err,
     });
   }
};

export const PostController = {
    createPost,
}
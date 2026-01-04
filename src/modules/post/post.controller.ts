import { Result } from './../../../generated/prisma/internal/prismaNamespace';
import { Request, Response } from "express";
import { postService } from './post.service';
import { Post } from '../../../generated/prisma/client';

const createPost = async (req:Request, res:Response) => {
  console.log(req.user)
   try{
      const user = req.user;
        if(!user){
          return res.status(401).json({error: "Unauthorized"})
        }
        const result = await postService.createPost(req.body, user.id as string);
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
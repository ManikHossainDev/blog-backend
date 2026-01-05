import { Payload } from './../../../generated/prisma/internal/prismaNamespace';
import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, "id" | "createdAt" | "updatedAt">, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result;
};

const getAllPosts = async (payload:{search: string | undefined}) => {
    const allposts = await prisma.post.findMany({
        where: {
            title: {
                contains: payload.search as string,
                mode: "insensitive"
            }
        }
    });
    return allposts;
}


export const postService = {
    createPost,
    getAllPosts
}
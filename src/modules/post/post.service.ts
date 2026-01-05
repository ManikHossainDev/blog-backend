import { Payload } from "./../../../generated/prisma/internal/prismaNamespace";
import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPosts = async (payload: {
  search: string ;
  tags: string[] | [];
}) => {
  const allposts = await prisma.post.findMany({
    where: {
      AND: [
       payload.search &&  {
          OR: [
            {
              title: {
                contains: payload.search,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: payload.search,
                mode: "insensitive",
              },
            },
            {
              tags: {
                has: payload.search,
              },
            },
          ],
        },
        {
          tags: {
            hasSome: payload.tags,
          },
        },
      ],
    },
  });
  return allposts;
};

export const postService = {
  createPost,
  getAllPosts,
};

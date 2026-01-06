import { Payload, PostWhereInput } from "./../../../generated/prisma/internal/prismaNamespace";
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

const getAllPosts = async ({
  search,
  tags,
  isFeatureed,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatureed?: boolean | undefined;
}) => {
  const andConditions: PostWhereInput[] = [];
  if (search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }
  if (tags.length > 0) {
    andConditions.push({
      tags: {
        hasSome: tags,
      },
    });
  }
    if (typeof isFeatureed === 'boolean') {
        andConditions.push({
        isFeatured: isFeatureed,
        });
    }
  const allposts = await prisma.post.findMany({
    where: {
      AND: andConditions,
    },
  });
  return allposts;
};

export const postService = {
    createPost,
    getAllPosts,
};

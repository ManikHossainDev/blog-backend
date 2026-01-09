import {
  Payload,
  PostWhereInput,
} from "./../../../generated/prisma/internal/prismaNamespace";
import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
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
  status,
  authorId,
  page,
  limit,
  skip,
  sortOrder,
  sortBy,
}: {
  search: string | undefined,
  tags: string[] | [],
  isFeatureed?: boolean | undefined,
  status: PostStatus | undefined,
  authorId: string | undefined,
  page: number,
  limit: number;
  skip: number;
  sortBy?:string;
  sortOrder?:string;
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
  if (typeof isFeatureed === "boolean") {
    andConditions.push({
      isFeatured: isFeatureed,
    });
  }
  if (status) {
    andConditions.push({
      status,
    });
  }
  if (authorId) {
    andConditions.push({
      authorId,
    });
  }

  const allPosts = await prisma.post.findMany({
    take: limit,
    skip: skip,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  
  const total = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });

  return { 
    data:allPosts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  };
};

const getPostById = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
   await tx.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const postData = await tx.post.findUnique({
      where: {
        id,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                }
              },
            },
          },
        },
      },
    });
    return postData;
  })
  return result;
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
};

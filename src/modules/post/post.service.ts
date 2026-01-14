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
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
    include: {
      _count: {
        select: {
          comments:true
        }
      }
    }
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
          orderBy: { createdAt: 'desc'},
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: {createdAt: 'asc'},
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                  orderBy: {createdAt: 'asc'}
                }
              },
            },
          },
        },
        _count: {
          select:{comments:true}
        }
      },
    });
    return postData;
  })
  return result;
};

const getMyPosts = async (authorId: string) => {
  const userInfo =  await prisma.user.findUniqueOrThrow({
    where:{
      id:authorId,
      status:"ACTIVE"
    },
    select:{
      id:true
    }
  })
  const result =  await prisma.post.findMany({
    where: { 
      authorId 
    },
    orderBy: { 
      createdAt: "desc"
     },
     include: {
      _count: {
        select:{
          comments:true
        }
      }
     }
  });

  return result

  // const total = await prisma.post.aggregate({
  //   _count: {
  //     id: true 
  //   },
  //   where:{
  //     authorId
  //   }
  // })
  // return {
  //   data:result,
  //   total
  // } 
};


const updateMyPost = async (postId:string, data:Partial<Post>, authorId:string, isAdmin:boolean) => {
   const postData = await prisma.post.findUniqueOrThrow({
     where: {
       id:postId
     },
     select:{
      id: true,
      authorId:true
     }
   })

   // Allow admin to update any post, but regular users can only update their own posts
   if (!isAdmin && postData.authorId !== authorId) {
     throw new Error("You are not the owner/creator of the post!");
   }

   // Prevent non-admins from updating isFeatured property
   if(!isAdmin){
     delete data.isFeatured
   }

   const result = await prisma.post.update({
     where: {
      id:postData.id
     },
     data
   })
   return result
} 

const deletePost = async (postId:string, authorId:string, isAdmin:boolean) => {
    const postData = await prisma.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      select: {
        id: true,
        authorId: true,
      },
    });
    if (!isAdmin && postData.authorId !== authorId) {
      throw new Error("You are not the owner/creator of the post!");
    } 
    
    return await prisma.post.delete({
      where:{
        id:postId,
      }
    })
}

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updateMyPost,
  deletePost,
};

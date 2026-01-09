import { Payload } from './../../../generated/prisma/internal/prismaNamespace';

const createComment = async (Payload: {
    content: string;
    authorId: string;
    postId: string;
    parentId: string;
}) => {
  // Implementation for creating a comment
  console.log(Payload);
}

export const commentService = {
  createComment,
};
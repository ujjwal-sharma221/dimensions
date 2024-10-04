"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createPostSchema } from "@/lib/validation-schema";
import { getPostDataInlcuded } from "@/lib/types";

export const createPost = async (input: {
  content: string;
  mediaIds: string[];
}) => {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const { content, mediaIds } = createPostSchema.parse(input);
  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      attachments: { connect: mediaIds.map((id) => ({ id })) },
    },
    include: getPostDataInlcuded(user.id),
  });

  return newPost;
};

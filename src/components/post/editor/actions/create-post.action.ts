"use server";

import { validateRequest } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createPostSchema } from "@/lib/validation-schema";

export const createPost = async (input: string) => {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const { content } = createPostSchema.parse({ content: input });
  await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
  });
};

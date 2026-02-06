'use server';

import { commentFormSchema } from '@/add/schema';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { updateTag } from 'next/cache';
import { z } from 'zod';

export const likePost = async (postId: number) => {
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    updateTag(`like-status-${postId}`);
  } catch (e) {}
};

export const dislikePost = async (postId: number) => {
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    updateTag(`like-status-${postId}`);
  } catch (e) {}
};

export const addComment = async (
  postId: number,
  prevState: any,
  formData: FormData
) => {
  const data = {
    payload: formData.get('payload'),
  };
  const session = await getSession();
  if (!session.id) {
    return;
  }
  const result = commentFormSchema.safeParse(data);
  if (!result.success) {
    return z.flattenError(result.error);
  }
  await db.comment.create({
    data: {
      payload: result.data.payload,
      user: { connect: { id: session.id! } },
      post: { connect: { id: postId } },
    },
  });
  updateTag(`post-comments`);
};

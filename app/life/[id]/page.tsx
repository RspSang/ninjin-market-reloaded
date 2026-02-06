import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';
import LikeButton from '@/components/LikeButton';
import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToTimeAgo } from '@/lib/utils';
import { EyeIcon } from '@heroicons/react/24/solid';
import { unstable_cache as nextCache } from 'next/cache';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

const getCachedPost = nextCache(getPost, ['post-detail'], {
  tags: ['post-detail'],
  revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

async function getCachedLikeStatus(postId: number) {
  const session = await getSession();
  const userId = session.id!;
  const cachedOperation = nextCache(getLikeStatus, ['product-like-status'], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId, userId);
}

async function getComments(postId: number) {
  const comments = await db.comment.findMany({
    where: { postId },
    orderBy: { created_at: 'desc' },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return comments;
}

export type CommentType = Awaited<ReturnType<typeof getComments>>[number];

const getCachedComments = nextCache(getComments, ['post-comments'], {
  tags: ['post-comments'],
  revalidate: 60,
});

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return notFound();
  }
  const post = await getCachedPost(idNumber);
  if (!post) {
    return notFound();
  }

  const { likeCount, isLiked } = await getCachedLikeStatus(idNumber);

  const comments = await getCachedComments(idNumber);
  return (
    <div className="p-5 text-white">
      <div className="flex items-center gap-2 mb-2">
        <Image
          width={28}
          height={28}
          className="size-7 rounded-full"
          src={post.user.avatar!}
          alt={post.user.username}
        />
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>閲覧 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={idNumber} />
      </div>
      <div className="border-b border-neutral-700 pt-5">
        <CommentList comments={comments} />
        <CommentForm postId={idNumber} />
      </div>
    </div>
  );
}

import { CommentType } from '@/life/[id]/page';
import { formatToTimeAgo } from '@/lib/utils';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface CommentListProps {
  comments: CommentType[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-neutral-500">
        <ChatBubbleLeftIcon className="size-10 mb-2" />
        <p>まだコメントがありません</p>
        <p className="text-sm">最初のコメントを投稿してみましょう</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <h3 className="text-sm font-semibold text-neutral-400">
        コメント {comments.length}件
      </h3>
      <ul className="flex flex-col gap-4">
        {comments.map(comment => (
          <li
            key={comment.id}
            className="flex gap-3 p-3 rounded-lg bg-neutral-800/50"
          >
            <div className="shrink-0">
              {comment.user.avatar ? (
                <Image
                  src={comment.user.avatar}
                  alt={comment.user.username}
                  width={36}
                  height={36}
                  className="size-9 rounded-full object-cover"
                />
              ) : (
                <div className="size-9 rounded-full bg-neutral-700 flex items-center justify-center">
                  <span className="text-sm text-neutral-400">
                    {comment.user.username[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {comment.user.username}
                </span>
                <span className="text-xs text-neutral-500">
                  {formatToTimeAgo(comment.created_at.toString())}
                </span>
              </div>
              <p className="text-sm text-neutral-300 wrap-break-word">
                {comment.payload}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

'use client';

import { useForm } from 'react-hook-form';
import Button from './Button';
import { commentFormSchema, CommentFormType } from '@/add/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { addComment } from '@/life/[id]/actions';

interface CommentFormProps {
  postId: number;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormType>({
    resolver: zodResolver(commentFormSchema),
  });

  const onSubmit = handleSubmit(async data => {
    const formData = new FormData();
    formData.append('payload', data.payload);

    await addComment(postId, null, formData);
    reset();
  });
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <textarea
        className="w-full h-24 p-2 rounded-md border border-neutral-700"
        {...register('payload')}
      />
      {errors.payload && (
        <p className="text-red-500">{errors.payload.message}</p>
      )}
      <Button text="コメントを投稿" />
    </form>
  );
}

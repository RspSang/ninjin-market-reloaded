'use client';

import Button from '@/components/Button';
import Input from '@/components/Input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { uploadProduct } from './actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { fileSchema, productSchema, ProductType } from './schema';
import { useForm } from 'react-hook-form';

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProductType>({
    // @ts-ignore
    resolver: zodResolver(productSchema),
  });

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const result = fileSchema.safeParse(selectedFile);
    if (!result.success) {
      setError('photo', {
        message: result.error.issues.map(err => err.message)[0],
      });
      event.target.value = '';
      return;
    }

    clearErrors('photo');
    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
    setFile(selectedFile);
    setValue('photo', `/${selectedFile.name}`);
  };

  const onSubmit = handleSubmit(async data => {
    const formData = new FormData();
    formData.append('photo', file!);
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price + '');

    return uploadProduct(null, formData);
  });
  
  return (
    <div>
      <form onSubmit={onSubmit} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{ backgroundImage: `url(${preview})` }}
        >
          {preview === '' ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                写真を追加してください
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        {errors.photo?.message && (
          <span className="text-red-500 text-sm">{errors.photo.message}</span>
        )}
        <Input
          placeholder="タイトル"
          type="text"
          {...register('title')}
          errors={[errors.title?.message ?? '']}
        />
        <Input
          type="number"
          {...register('price')}
          placeholder="価格"
          errors={[errors.price?.message ?? '']}
        />
        <Input
          type="text"
          {...register('description')}
          placeholder="説明"
          errors={[errors.description?.message ?? '']}
        />
        <Button text="作成完了" />
      </form>
    </div>
  );
}

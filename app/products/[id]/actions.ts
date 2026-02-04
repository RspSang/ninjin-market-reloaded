'use server';

import fs from 'fs/promises';
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import getSession from '@/lib/session';
import { productSchema } from '@/add/schema';
import { z } from 'zod';

export async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export async function checkIsOwner(userId: number) {
  const session = await getSession();
  return session.id === userId;
}

export async function updateProduct(_prevState: any, formData: FormData) {
  const id = formData.get('id');
  if (!id || typeof id !== 'string') {
    return { formErrors: ['商品IDが必要です'] };
  }

  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return { formErrors: ['無効な商品IDです'] };
  }

  const session = await getSession();
  const product = await db.product.findUnique({
    where: { id: idNumber },
    select: { userId: true, photo: true },
  });

  if (!product) {
    return { formErrors: ['商品が見つかりません'] };
  }

  if (session.id !== product.userId) {
    return { formErrors: ['権限がありません'] };
  }

  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };

  // 새 이미지가 업로드된 경우
  if (data.photo instanceof File && data.photo.size > 0) {
    const photoData = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    data.photo = `/${data.photo.name}`;
  } else {
    // 기존 이미지 유지
    data.photo = product.photo;
  }

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return z.flattenError(result.error);
  }

  await db.product.update({
    where: { id: idNumber },
    data: {
      title: result.data.title,
      price: result.data.price,
      description: result.data.description,
      photo: result.data.photo,
    },
  });

  redirect(`/products/${idNumber}`);
}

export const deleteProduct = async (formData: FormData) => {
  const id = formData.get('id');

  if (!id || typeof id !== 'string') {
    return;
  }

  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return;
  }

  const session = await getSession();
  const product = await db.product.findUnique({
    where: { id: idNumber },
    select: { userId: true },
  });

  if (!product) {
    return;
  }

  if (session.id !== product.userId) {
    return;
  }

  await db.product.delete({
    where: { id: idNumber },
  });

  redirect('/products');
};

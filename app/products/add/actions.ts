'use server';

import fs from 'fs/promises';
import db from '@/lib/db';
import { redirect } from 'next/navigation';
import getSession from '@/lib/session';
import { productSchema } from './schema';
import { z } from 'zod';

export async function uploadProduct(prevState: any, formData: FormData) {
  const data = {
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };
  if (data.photo instanceof File) {
    const photoData = await data.photo.arrayBuffer();
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    data.photo = `/${data.photo.name}`;
  }
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return z.flattenError(result.error);
  }

  const session = await getSession();
  if (!session.id) {
    return;
  }

  const product = await db.product.create({
    data: {
      title: result.data.title,
      price: result.data.price,
      description: result.data.description,
      photo: result.data.photo,
      user: {
        connect: {
          id: session.id,
        },
      },
    },
    select: {
      id: true,
    },
  });

  redirect(`/products/${product.id}`);
}

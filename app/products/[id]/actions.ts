'use server';

import db from '@/lib/db';
import { redirect } from 'next/navigation';
import getSession from '@/lib/session';

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

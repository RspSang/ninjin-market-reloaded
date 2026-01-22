import db from '@/lib/db';
import getSession from '@/lib/session';
import { formatToYen } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
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
  return product;
}

async function checkIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return notFound();
  }

  const product = await getProduct(idNumber);
  if (!product) {
    return notFound();
  }

  const isOwner = await checkIsOwner(product.userId);

  async function deleteProduct() {
    'use server';
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
  }

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          unoptimized
          src={product.photo}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className="flex items-center gap-3 p-5 border-b border-neutral-700">
        <div className="overflow-hidden rounded-full size-10">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              alt={product.user.username}
              width={40}
              height={40}
              unoptimized
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed bottom-0 left-0 flex items-center justify-between w-full p-5 pb-10 bg-neutral-800">
        <span className="text-xl font-semibold">
          {formatToYen(product.price)}円
        </span>
        <form className="flex gap-2" action={deleteProduct}>
          {isOwner ? (
            <button
              className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold hover:bg-red-600 transition-all hover:cursor-pointer"
              type="submit"
            >
              商品を削除
            </button>
          ) : (
            <Link
              href={``}
              className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold hover:bg-orange-600 transition-all"
            >
              チャット
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}

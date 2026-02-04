import CloseButton from '@/components/CloseButton';
import ModalBackdrop from '@/components/ModalBackdrop';
import db from '@/lib/db';
import { checkIsOwner } from '@/lib/session';
import { formatToYen } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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

export default async function ProductModal({
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

  return (
    <ModalBackdrop>
      <CloseButton />
      <div className="relative w-full h-3/5 max-w-5xl bg-neutral-900 rounded-lg mx-4 flex">
        {/* 상품 이미지 */}
        <div className="relative aspect-square w-full max-w-2xl">
          <Image
            fill
            unoptimized
            src={product.photo}
            alt={product.title}
            className="object-cover rounded-t-lg"
          />
        </div>

        <div className="w-full">
          {/* 판매자 정보 */}
          <div className="flex items-center gap-3 p-4 border-b border-neutral-700">
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
                <UserIcon className="size-10 text-neutral-500" />
              )}
            </div>
            <h3 className="text-white">{product.user.username}</h3>
          </div>

          {/* 상품 정보 */}
          <div className="p-4">
            <h1 className="text-xl font-semibold text-white">
              {product.title}
            </h1>
            <p className="mt-2 text-neutral-400">{product.description}</p>
          </div>

          {/* 가격 및 버튼 */}
          <div className="flex items-center justify-between p-4 border-t border-neutral-700">
            <span className="text-xl font-semibold text-white">
              {formatToYen(product.price)}円
            </span>
            {isOwner ? (
              <div className="flex gap-2">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="bg-blue-500 px-5 py-2.5 rounded-md text-white font-semibold hover:bg-blue-600 transition-all"
                >
                  商品を編集
                </Link>
                <button
                  className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold hover:bg-red-600 transition-all hover:cursor-pointer"
                  type="submit"
                >
                  商品を削除
                </button>
              </div>
            ) : (
              <Link
                href={``}
                className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold hover:bg-orange-600 transition-all"
              >
                チャット
              </Link>
            )}
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

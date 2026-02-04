import { getProduct, checkIsOwner } from '@/products/[id]/actions';
import { notFound } from 'next/navigation';
import EditProductForm from '@/components/EditProductForm';

export default async function EditProduct({
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

  if (!isOwner) {
    return notFound();
  }

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">商品を編集</h1>
      <EditProductForm product={product} />
    </div>
  );
}

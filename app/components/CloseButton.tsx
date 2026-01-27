'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export default function CloseButton() {
  const router = useRouter();

  const onClose = () => {
    router.back();
  };

  return (
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-neutral-300 hover:text-white transition-colors hover:cursor-pointer"
    >
      <XMarkIcon className="size-8" />
    </button>
  );
}

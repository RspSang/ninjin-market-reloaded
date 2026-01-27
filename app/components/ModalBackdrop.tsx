'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ModalBackdropProps {
  children: React.ReactNode;
}

export default function ModalBackdrop({ children }: ModalBackdropProps) {
  const router = useRouter();

  const onClose = () => {
    router.back();
  };

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // 딤 영역 클릭 시 닫기
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      {children}
    </div>
  );
}

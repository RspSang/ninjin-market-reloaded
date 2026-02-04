import CloseButton from '@/components/CloseButton';
import ModalBackdrop from '@/components/ModalBackdrop';

export default function ModalLoading() {
  return (
    <ModalBackdrop>
      <CloseButton />
      <div className="relative w-full h-3/5 max-w-5xl bg-neutral-900 rounded-lg mx-4 flex animate-pulse">
        {/* 왼쪽: 상품 이미지 스켈레톤 */}
        <div className="relative aspect-square w-full max-w-2xl bg-neutral-800 rounded-l-lg" />

        {/* 오른쪽: 정보 */}
        <div className="w-full">
          {/* 판매자 정보 스켈레톤 */}
          <div className="flex items-center gap-3 p-4 border-b border-neutral-700">
            <div className="size-10 rounded-full bg-neutral-800" />
            <div className="h-4 w-24 bg-neutral-800 rounded" />
          </div>

          {/* 상품 정보 스켈레톤 */}
          <div className="p-4 space-y-3">
            <div className="h-6 w-3/4 bg-neutral-800 rounded" />
            <div className="h-4 w-full bg-neutral-800 rounded" />
            <div className="h-4 w-2/3 bg-neutral-800 rounded" />
          </div>

          {/* 가격 및 버튼 스켈레톤 */}
          <div className="flex items-center justify-between p-4 border-t border-neutral-700">
            <div className="h-6 w-24 bg-neutral-800 rounded" />
            <div className="h-10 w-24 bg-neutral-800 rounded-md" />
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

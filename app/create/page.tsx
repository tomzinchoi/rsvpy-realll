'use client';

import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CreateEventPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black pt-24 pb-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="glass-card rounded-lg p-12 text-center">
            <h1 className="text-3xl font-bold mb-8 text-gradient">이벤트 생성 기능 준비 중</h1>
            <p className="text-white text-lg mb-8">
              이벤트 생성 기능은 현재 개발 중입니다. 곧 사용하실 수 있을 예정입니다.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="spacex-button rounded text-center py-3 px-8"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

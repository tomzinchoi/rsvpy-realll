'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EventEditorPage({ params }: PageProps) {
  const { id } = params;
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-lg p-8 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">에디터 기능 준비 중</h1>
            <p className="mb-6">
              이벤트 페이지 에디터 기능은 현재 개발 중입니다. 곧 출시될 예정입니다.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              홈으로 돌아가기
            </button>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

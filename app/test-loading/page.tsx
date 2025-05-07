'use client';

import { useRouter } from 'next/navigation';

export default function TestLoadingPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="glass-card p-8 rounded-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-white mb-4">RSVPY 연결 테스트</h1>
        
        <p className="text-white mb-6">
          이 기능은 현재 개발 중입니다. 곧 사용하실 수 있을 예정입니다.
        </p>
        
        <div className="mt-6">
          <button 
            onClick={() => router.push('/')}
            className="spacex-button py-2 px-4 rounded inline-block"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

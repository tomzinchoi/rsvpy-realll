import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-sm text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">RSVPY</h1>
        <p className="text-xl mb-10">Create, share, and manage invitations and RSVPs with ease</p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/create" className="btn-black">
            Create New Invitation
          </Link>
          <Link href="/dashboard" className="btn-black">
            View Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Create Beautiful Invitations</h2>
          <p className="text-gray-600">Design custom invitations with our intuitive editor.</p>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Manage RSVPs</h2>
          <p className="text-gray-600">Track responses and manage your guest list effortlessly.</p>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">Share with Everyone</h2>
          <p className="text-gray-600">Send invitations via email and track status.</p>
        </div>
      </div>
    </main>
  );
}

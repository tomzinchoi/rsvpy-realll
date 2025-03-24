import LoadingSpinner from '@/components/LoadingSpinner'

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center">
          <LoadingSpinner size="large" color="accent" />
        </div>
        <p className="mt-4 text-white">Loading RSVPY...</p>
      </div>
    </div>
  )
}

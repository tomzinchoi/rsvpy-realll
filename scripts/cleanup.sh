#!/bin/bash

echo "Starting comprehensive cleanup process..."

# 1. Redirect admin/setup to setup page
echo "Setting up redirects..."
if [[ -d /workspaces/rsvpy-realll/app/admin/setup ]]; then
  mkdir -p /workspaces/rsvpy-realll/app/admin
  cat > /workspaces/rsvpy-realll/app/admin/setup/page.tsx << 'EOL'
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminSetupRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/setup');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mb-4"></div>
      <p className="text-center">Redirecting to the new setup page...</p>
      <Link href="/setup" className="text-blue-600 hover:underline mt-4">Click here if you're not redirected automatically</Link>
    </div>
  );
}
EOL
  echo "Created admin setup redirect page."
fi

# 2. Check for duplicate files in src directory
echo "Removing duplicate files from src directory..."
if [[ -d /workspaces/rsvpy-realll/src/app ]]; then
  rm -rf /workspaces/rsvpy-realll/src/app
  echo "Removed duplicate app directory from src."
  
  if [[ -z "$(ls -A /workspaces/rsvpy-realll/src)" ]]; then
    rm -rf /workspaces/rsvpy-realll/src
    echo "Removed empty src directory."
  fi
fi

# 3. Ensure proper ConfigCheck component structure
echo "Setting up ConfigCheck component..."
if [[ ! -d /workspaces/rsvpy-realll/components/setup ]]; then
  mkdir -p /workspaces/rsvpy-realll/components/setup
  echo "Created components/setup directory."
fi

# 4. Copy files if they don't exist
for component in NextStepsGuide StorageInfo SubscriptionBenefits; do
  if [[ ! -f /workspaces/rsvpy-realll/components/setup/${component}.tsx ]]; then
    touch /workspaces/rsvpy-realll/components/setup/${component}.tsx
    echo "Created placeholder for ${component}."
  fi
done

# 5. Remove any backup or temporary files
echo "Removing backup files..."
find /workspaces/rsvpy-realll -name "*.bak" -delete
find /workspaces/rsvpy-realll -name "*.tmp" -delete
find /workspaces/rsvpy-realll -name "*~" -delete

echo "Cleanup completed successfully!"
echo "You can now safely remove this script with:"
echo "rm -f /workspaces/rsvpy-realll/scripts/cleanup.sh"

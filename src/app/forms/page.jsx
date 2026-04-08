'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Redirect /forms → /forms/index which renders the full forms grid
export default function FormsIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/forms/index');
  }, [router]);
  return null;
}

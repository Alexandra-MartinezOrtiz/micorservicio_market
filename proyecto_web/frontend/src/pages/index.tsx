import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/shared/hooks/useAuth';

export default function Home() {
  const { isAuthenticated, loading, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized || loading) return;
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, isInitialized, router]);

  return <div>Cargando...</div>;
}
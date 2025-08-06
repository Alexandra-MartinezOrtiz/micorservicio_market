
import { useAuth } from '@/shared/hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useRef, PropsWithChildren } from 'react';

export default function ProtectedLayout({ children }: PropsWithChildren) {
  const { isAuthenticated, loading, isInitialized, error } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isInitialized || loading || hasRedirected.current) return;
    if (!isAuthenticated) {
      hasRedirected.current = true;
      router.replace('/login');
    }
  }, [isAuthenticated, loading, isInitialized, router]);

  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">Inicializando autenticación...</div>;
  }
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Verificando autenticación...</div>;
  }
  if (!isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center">Redirigiendo a login...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return <>{children}</>;
}
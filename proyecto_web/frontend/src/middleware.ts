// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    
    // Solo verificar el token JWT en localStorage desde el cliente
    // El middleware NO puede acceder a localStorage, así que solo 
    // manejamos rutas básicas aquí
    
    // Si es la ruta raíz, redirigir al dashboard (la página decidirá si mostrar login)
    if (path === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Permitir todas las demás rutas - la lógica de autenticación 
    // se maneja en el cliente con useAuth
    return NextResponse.next();
    
  } catch (error) {
    console.error('Error en middleware:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
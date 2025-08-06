import type { AppProps } from 'next/app';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  // Remover toda lógica de redirección de aquí
  // Dejar que cada página maneje su propia lógica
  return <Component {...pageProps} />;
}
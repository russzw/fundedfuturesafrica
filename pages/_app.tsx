import '../globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '../components/Layout';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;

import '../globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '../components/Layout';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import { ThemeProvider } from '../contexts/ThemeContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
        <Analytics />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7607642864813824"
          crossOrigin="anonymous"
        />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;


import { ReactNode } from 'react';
import Head from 'next/head.js';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {children}
      </div>
    </>
  );
}

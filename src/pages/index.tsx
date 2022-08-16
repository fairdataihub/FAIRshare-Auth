import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export default function Index() {
  return (
    <div className="flex h-screen flex-col justify-between">
      <Head>
        <title>FAIRshare Authentication platform</title>
        <meta name="description" content="FAIRshare Authentication platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">
          FAIRshare Authentication platform
        </h1>

        <div className="my-5 flex space-x-2">
          <Link href="/github-oauth">
            <a className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
              GitHub OAuth
            </a>
          </Link>
          <Link href="/zenodo-oauth">
            <a className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
              Zenodo OAuth
            </a>
          </Link>
          <Link href="/figshare">
            <a className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
              Figshare OAuth
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}

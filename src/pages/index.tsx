import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

import LottieAnimation from '@/components/lotties';

import heroLottie from '~/lotties/authentication.json';

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col justify-between">
      <Head>
        <title>FAIRshare Authentication platform</title>
        <meta name="description" content="FAIRshare Authentication platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="mb-10 flex items-center justify-center">
          <LottieAnimation
            animationData={heroLottie}
            width={200}
            height={200}
          />
        </div>

        <h1 className="text-5xl font-bold text-slate-800">
          FAIRshare Authentication Platform
        </h1>

        <div className="my-5 flex space-x-2">
          <Link href="/github">
            <a className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
              GitHub OAuth
            </a>
          </Link>
          <Link href="/zenodo">
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

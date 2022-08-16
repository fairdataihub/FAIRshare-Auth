import Head from 'next/head';
import React, { useEffect } from 'react';

import LottieAnimation from '@/components/lotties';

import heroLottie from '~/lotties/connecting.json';

export default function GitHubOAuth() {
  const redirectURI = encodeURIComponent(
    `https://auth.fairshareapp.io/zenodo-sandbox/callback`,
  );
  const tokenScope = encodeURIComponent(`deposit:write deposit:actions`);
  const responseType = encodeURIComponent(`code`);

  const ZENODO_OAUTH_URL = `https://sandbox.zenodo.org/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_ZENODO_SANDBOX_CLIENT_ID}&scope=${tokenScope}&redirect_uri=${redirectURI}&response_type=${responseType}`;

  useEffect(() => {
    // redirect to github oauth
    setTimeout(() => {
      window.location.href = ZENODO_OAUTH_URL;
    }, 2000);
  }, [ZENODO_OAUTH_URL]);

  return (
    <div className="flex h-screen flex-col justify-between">
      <Head>
        <title>FAIRshare Authentication platform</title>
        <meta name="description" content="FAIRshare Authentication platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-3xl font-medium">
          Please wait while we redirect you to Zenodo sandbox...
        </h1>
        <div className="flex justify-center  ">
          <LottieAnimation
            animationData={heroLottie}
            width={200}
            height={200}
          />
        </div>
      </main>
    </div>
  );
}

import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';

import LottieAnimation from '@/components/lotties';

import heroLottie from '~/lotties/connecting.json';

interface PageProps {
  session: string | undefined;
}

const FigshareOAuth: React.FC<PageProps> = ({ session }) => {
  const redirectURI = encodeURIComponent(
    `https://auth.fairshareapp.io/figshare/callback`,
  );
  const tokenScope = encodeURIComponent(`all`);
  const responseType = encodeURIComponent(`code`);

  const FIGSHARE_OAUTH_URL = `https://figshare.com/account/applications/authorize?client_id=${process.env.NEXT_PUBLIC_FIGSHARE_CLIENT_ID}&scope=${tokenScope}&redirect_uri=${redirectURI}&response_type=${responseType}`;

  useEffect(() => {
    if (session) {
      sessionStorage.setItem('figshare-session', session);
    }

    // redirect to figshare oauth
    setTimeout(() => {
      window.location.href = FIGSHARE_OAUTH_URL;
    }, 2000);
  }, [FIGSHARE_OAUTH_URL, session]);

  return (
    <div className="flex h-screen flex-col justify-between">
      <Head>
        <title>FAIRshare Authentication platform</title>
        <meta name="description" content="FAIRshare Authentication platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-3xl font-medium">
          Please wait while we redirect you to figshare...
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
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  let session: string | string[] | undefined = '';

  if (`session` in query) {
    session = query.session;
  }

  return {
    props: {
      session,
    },
  };
};

export default FigshareOAuth;

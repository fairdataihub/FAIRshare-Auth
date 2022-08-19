import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';

import LottieAnimation from '@/components/lotties';

import heroLottie from '~/lotties/connecting.json';

interface PageProps {
  session: string | undefined;
}

const GitHubOAuth: React.FC<PageProps> = ({ session }) => {
  const GITHUB_OAUTH_URL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&scope=repo%20admin:repo_hook%20admin:org_hook%20user`;

  useEffect(() => {
    if (session) {
      sessionStorage.setItem('github-session', session);
    }

    // redirect to github oauth workflow
    setTimeout(() => {
      window.location.href = GITHUB_OAUTH_URL;
    }, 2000);
  }, [GITHUB_OAUTH_URL, session]);

  return (
    <div className="flex h-screen flex-col justify-between">
      <Head>
        <title>FAIRshare Authentication platform</title>
        <meta name="description" content="FAIRshare Authentication platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-3xl font-medium">
          Please wait while we redirect you to GitHub...
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

export default GitHubOAuth;

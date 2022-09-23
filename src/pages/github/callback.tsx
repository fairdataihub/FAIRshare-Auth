import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import LottieAnimation from '@/components/lotties';
import TokenView from '@/components/TokenView';

import heroLottie from '~/lotties/invalidCode.json';

interface PageProps {
  GitHubToken: string;
  errorMessage?: string;
}

const GitHubOAuthCallback: React.FC<PageProps> = ({
  GitHubToken,
  errorMessage,
}) => {
  const router = useRouter();

  useEffect(() => {
    const session_id = sessionStorage.getItem('github-session');

    // remove session from storage - makes the session one time use only.
    sessionStorage.removeItem('github-session');

    if (GitHubToken != `error`) {
      // send the link to fairshare to authenticate the user
      router.push(
        `fairshare://auth-github?session=${session_id}&token=${GitHubToken}`,
      );
    }
  });

  return (
    <div className="flex h-screen flex-col justify-between">
      <Head>
        <title>Github | FAIRshare Authentication platform</title>
        <meta name="description" content="FAIRshare Authentication platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 flex-col items-center justify-center">
        {GitHubToken != `error` ? (
          <>
            <h1 className="my-2 text-3xl font-medium">
              Successfully authenticated with GitHub!
            </h1>

            <p className="mb-8 text-center text-lg">
              We will try to open your FAIRshare application and paste the
              following details in automatically. <br /> Click &apos;Open&apos;
              if you are asked to do so.
            </p>

            <TokenView label="Access Token" token={GitHubToken} />

            <p className="mt-8 text-base text-slate-600">
              You can copy and paste the following tokens manually if we are
              unable to open your application.
            </p>
          </>
        ) : (
          <div className="flex flex-row items-center justify-center">
            <div className="flex justify-center  ">
              <LottieAnimation
                animationData={heroLottie}
                width={200}
                height={200}
              />
            </div>

            <div className="flex flex-col ">
              <h1 className="my-2 text-3xl font-medium">
                Something went wrong!
              </h1>

              <pre className="text-sm text-gray-50">{errorMessage}</pre>

              <Link href="/github">
                <span className="cursor-pointer text-blue-600 underline visited:text-purple-600 hover:text-blue-800">
                  Try authentication again
                </span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  let GitHubToken;
  let errorMessage = '';

  if (`code` in query) {
    const body = {
      client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: query.code,
    };

    const opts = { headers: { accept: `application/json` } };

    GitHubToken = await axios
      .post(`https://github.com/login/oauth/access_token`, body, opts)
      .then((res) => {
        if (res !== undefined && `data` in res && `access_token` in res.data) {
          return res.data[`access_token`];
        } else {
          errorMessage = res.data;
          return `error`;
        }
      })
      .catch((err) => {
        errorMessage = err;
        return `error`;
      });
  } else {
    GitHubToken = `error`;
  }

  return {
    props: {
      GitHubToken,
      errorMessage,
    },
  };
};

export default GitHubOAuthCallback;

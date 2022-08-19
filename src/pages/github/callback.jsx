import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import LottieAnimation from '@/components/lotties';

import heroLottie from '~/lotties/invalidCode.json';

export default function GitHubOAuthCallback({ GitHubToken }) {
  const router = useRouter();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(GitHubToken);
  };

  useEffect(() => {
    const session_id = sessionStorage.getItem('github-session');

    // remove session from storage - makes the session one time use only.
    sessionStorage.removeItem('github-session');

    router.push(
      `fairshare://auth-github?session=${session_id}&token=${GitHubToken}`,
    );
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
            <p className="text-lg">
              Copy and paste the following code into FAIRshare
            </p>
            <div className=" my-4 flex flex-row rounded-lg bg-slate-100 px-3 py-2">
              <p>{GitHubToken}</p>
              <div className="ml-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 rounded-md hover:cursor-pointer hover:bg-slate-300 active:translate-y-1 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  onClick={copyToClipboard}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </div>
            </div>
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

              <Link href="/github-oauth">
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
}

export const getServerSideProps = async ({ query }) => {
  let GitHubToken;
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
          // return `error`;
        } else {
          return `error`;
        }
      })
      .catch((_err) => `error`);
  } else {
    GitHubToken = `error`;
  }

  return {
    props: {
      GitHubToken,
    },
  };
};

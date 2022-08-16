import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import qs from 'qs';
// import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import LottieAnimation from '@/components/lotties';

import heroLottie from '~/lotties/invalidCode.json';

export default function ZenodoOAuthCallback({ accessToken, refreshToken }) {
  // const router = useRouter();

  const copyToClipboard = (token) => {
    navigator.clipboard.writeText(token);
  };

  useEffect(() => {
    /**
     * TODO: come back to this one
     */
    // router.push('fairshare://githuboauth');
  });

  return (
    <div className="flex h-screen flex-col justify-between">
      <Head>
        <title>Zenodo | FAIRshare Authentication platform</title>
        <meta name="description" content="FAIRshare Authentication platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 flex-col items-center justify-center">
        {accessToken != `error` ? (
          <>
            <h1 className="my-2 text-3xl font-medium">
              Successfully authenticated with Zenodo!
            </h1>
            <p className="text-lg">
              Copy and paste the following code into FAIRshare
            </p>
            <div className=" my-4 flex flex-row rounded-lg bg-slate-100 px-3 py-2">
              <p>{accessToken}</p>

              <div className="ml-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 rounded-md hover:cursor-pointer hover:bg-slate-300 active:translate-y-1 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  onClick={() => copyToClipboard(accessToken)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </div>
            </div>
            <div className=" my-4 flex flex-row rounded-lg bg-slate-100 px-3 py-2">
              <p>{refreshToken}</p>
              <div className="ml-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 rounded-md hover:cursor-pointer hover:bg-slate-300 active:translate-y-1 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  onClick={() => copyToClipboard(refreshToken)}
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

              <Link href="/zenodo-oauth">
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
  let accessToken;
  let refreshToken;

  if (`code` in query) {
    const body = qs.stringify({
      client_id: process.env.NEXT_PUBLIC_ZENODO_CLIENT_ID,
      client_secret: process.env.ZENODO_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: query.code,
      redirect_uri: `https://auth.fairshareapp.io/zenodo/callback`,
    });

    const opts = {
      headers: {
        accept: `application/json`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    await axios
      .post(`https://zenodo.org/oauth/token`, body, opts)
      .then((res) => {
        if (res !== undefined && `data` in res && `access_token` in res.data) {
          accessToken = res.data[`access_token`];
          refreshToken = res.data[`refresh_token`];
          return;
        } else {
          accessToken = `error`;
          refreshToken = `error`;
          return;
        }
      })
      .catch((_err) => {
        accessToken = `error`;
        refreshToken = `error`;
        return `error`;
      });
  } else {
    accessToken = `error`;
    refreshToken = `error`;
  }

  return {
    props: {
      accessToken,
      refreshToken,
    },
  };
};

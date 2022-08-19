import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import qs from 'qs';
import React, { useEffect } from 'react';

import LottieAnimation from '@/components/lotties';

import heroLottie from '~/lotties/invalidCode.json';

interface PageProps {
  accessToken: string;
  refreshToken: string;
}

const FigshareOAuthCallback: React.FC<PageProps> = ({
  accessToken,
  refreshToken,
}) => {
  const router = useRouter();

  const copyToClipboard = (token: string) => {
    navigator.clipboard.writeText(token);
  };

  useEffect(() => {
    const session_id = sessionStorage.getItem('figshare-session');

    // remove session from storage - makes the session one time use only.
    sessionStorage.removeItem('figshare-session');

    if (accessToken != `error` && refreshToken != `error`) {
      // send the link to fairshare to authenticate the user
      router.push(
        `fairshare://auth-figshare?session=${session_id}&token=${accessToken}&refreshToken=${refreshToken}`,
      );
    }
  });

  return (
    <div className="flex h-screen flex-col justify-between">
      <Head>
        <title>Figshare | FAIRshare Authentication platform</title>
        <meta name="description" content="FAIRshare Authentication platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 flex-col items-center justify-center">
        {accessToken != `error` && refreshToken != `error` ? (
          <>
            <h1 className="my-2 text-3xl font-medium">
              Successfully authenticated with Figshare!
            </h1>

            <p className="text-center text-lg">
              We will try to open your FAIRshare application and paste the
              following details in automatically. <br /> Click &apos;Open&apos;
              if you are asked to do so.
            </p>

            <div className="mt-12 mb-4 flex flex-row items-center space-x-4">
              <span className="text-base font-medium"> Access Token: </span>

              <div className="flex flex-row rounded-lg bg-slate-100 px-3 py-2">
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
            </div>

            <div className="mt-4 mb-12 flex flex-row items-center space-x-4">
              <span className="text-base font-medium"> Refresh Token: </span>

              <div className="flex flex-row rounded-lg bg-slate-100 px-3 py-2">
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
            </div>

            <p className="text-base text-slate-600">
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

              <Link href="/figshare">
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
  let accessToken;
  let refreshToken;

  if (`code` in query) {
    const body = qs.stringify({
      client_id: process.env.NEXT_PUBLIC_FIGSHARE_CLIENT_ID,
      client_secret: process.env.FIGSHARE_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: query.code,
      redirect_uri: `https://auth.fairshareapp.io/figshare/callback`,
    });

    const opts = {
      headers: {
        accept: `application/json`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    await axios
      .post(`https://api.figshare.com/v2/token`, body, opts)
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

export default FigshareOAuthCallback;

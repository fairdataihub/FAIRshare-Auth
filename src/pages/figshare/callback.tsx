import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import qs from 'qs';
import React, { useEffect } from 'react';

import LottieAnimation from '@/components/lotties';
import TokenView from '@/components/TokenView';

import heroLottie from '~/lotties/invalidCode.json';

interface PageProps {
  accessToken: string;
  refreshToken: string;
}

const FigshareOAuthCallback: React.FC<PageProps> = ({
  accessToken,
  refreshToken,
}) => {
  // const router = useRouter();

  useEffect(() => {
    // const session_id = sessionStorage.getItem('figshare-session');

    // remove session from storage - makes the session one time use only.
    sessionStorage.removeItem('figshare-session');

    if (accessToken != `error` && refreshToken != `error`) {
      // send the link to fairshare to authenticate the user
      // router.push(
      //   `fairshare://auth-figshare?session=${session_id}&token=${accessToken}&refreshToken=${refreshToken}`,
      // );
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
            <h1 className="my-2 text-center text-3xl font-medium">
              Successfully authenticated with Figshare!
            </h1>

            <p className="mb-8 text-center text-lg">
              We will try to open your FAIRshare application and paste the
              following details in automatically. <br /> Click &apos;Open&apos;
              if you are asked to do so.
            </p>

            <TokenView label="Access Token" token={accessToken} />

            <TokenView label="Refresh Token" token={refreshToken} />

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

  accessToken =
    'af2e71c6e749eced15ee49d880cffa687efb8be99aaf7254fff826ca933a346e4c06e9a7e99d85ed7a4f783939a6f9befda21a00b196013aa6c2256645341ea6';
  refreshToken =
    '9153f5cad9bc77367699676cb34aeb3adfc2f6748ae9b15899149c57ded8e5bbbf09cb531617bb15542d55c9d3678a388db8df276544e9aa799046d2ae4b5d85';

  return {
    props: {
      accessToken,
      refreshToken,
    },
  };
};

export default FigshareOAuthCallback;

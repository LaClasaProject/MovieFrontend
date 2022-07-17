import type { AppProps } from 'next/app'
import '../styles/index.sass'

import Head from 'next/head'
import 'antd/dist/antd.dark.css'

import Script from 'next/script'

const MovieApp = (
  {
    Component,
    pageProps
  }: AppProps
) => (
  <>
    <Head>
      {
        process.env.adsense?.enabled ? (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.adsense?.client}`}
            crossOrigin='anonymous'
          />
        ) : null
      }

      <title>Movies & Series</title>
    </Head>

    <Component {...pageProps} />
  </>
)

export default MovieApp
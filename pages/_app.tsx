import type { AppProps } from 'next/app'
import '../styles/index.sass'

import Head from 'next/head'
import 'antd/dist/antd.dark.css'

const MovieApp = (
  {
    Component,
    pageProps
  }: AppProps
) => (
  <>
    <Head>
      <link
        href='https://vjs.zencdn.net/7.20.1/video-js.css'
        rel='stylesheet'
      />
      <title>Movies & Series</title>
    </Head>

    <Component {...pageProps} />
  </>
)

export default MovieApp
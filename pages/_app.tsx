import type { AppProps } from 'next/app'
import Head from 'next/head'

import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'antd/dist/antd.dark.css'

import '../styles/main.css'
import '../styles/button.css'

import '../styles/carousel.css'
import '../styles/watch.css'

const MovieApp = (
  {
    Component,
    pageProps
  }: AppProps
) => (
  <>
    <Head>
      <title>Movies & Series</title>
    </Head>

    <Component {...pageProps} />
  </>
)

export default MovieApp
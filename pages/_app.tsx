import type { AppProps } from 'next/app'
import '../styles/index.sass'

import Head from 'next/head'
import 'antd/dist/antd.dark.css'

import 'react-responsive-carousel/lib/styles/carousel.min.css'

// v2 css
import '../styles/v2/main.css'

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
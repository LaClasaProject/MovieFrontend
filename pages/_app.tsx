import type { AppProps } from 'next/app'
import '../styles/index.sass'

import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'

import 'primeicons/primeicons.css'
import 'plyr-react/dist/plyr.css'

import Head from 'next/head'

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
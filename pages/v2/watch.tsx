import { NextPage } from 'next'
import {
  IVideoDataV2
} from '../../src/types'

import WatchCarousel from '../../components/WatchCarousel'

interface IApiVideoData {
  videos: IVideoDataV2[]
}

// todo: reflect new api
const WatchPage: NextPage<IApiVideoData> = ({ videos }) => (
  <WatchCarousel
    videos={[]}
    header={
      (
        <h2>
          Top 5 of the Day
        </h2>
      )
    }
  />
)

const getServerSideProps = async () => {
  let res: { data: IVideoDataV2[], code?: number }

  try {
    res = await (
      await fetch(`${process.env.API_HOST}/v2/videos`)
    )?.json() as any
  } catch(err) {
    res = { data: [] }
  }

  return {
    props: {
      videos: res.data
    }
  }
}

export default WatchPage
export { getServerSideProps }
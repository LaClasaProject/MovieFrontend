import { NextPage } from 'next'
import {
  IVideoData
} from '../src/types'

import WatchCarousel from '../components/WatchCarousel'
import { useRef, useState } from 'react'

import Button from '../components/Button'
import SkeletonImage from '../components/SkeletonImage'

import MovieDrawer from '../components/MovieDrawer'

const reqUrl = `${process.env.API_HOST}/videos`

interface IApiVideoData {
  videos: IVideoData[]
  upcoming: IVideoData[]
  pinned: IVideoData[]
}

const WatchPage: NextPage<IApiVideoData> = ({ videos, upcoming, pinned }) => {
  const [video, setVideo] = useState<IVideoData | null>(null),
    videoRef = useRef() as any,
    [season, setSeason] = useState<number>(0),
    [page, setPage] = useState<number>(1),
    [videosInPage, setVideosInPage] = useState<IVideoData[]>(videos)

  const getVideos = async (page: number, limit = 10) => {
    const skip = (page - 1) * limit,
      videos: IVideoData[] = (
        await (
          await fetch(`${reqUrl}?skip=${skip}&limit=${limit}`)
        ).json() as any
      ).data ?? []

    return videos
  }

  return (
    <div
      style={
        {
          display: 'flex',
          flexDirection: 'column',

          gap: '50px',
          justifyContent: 'center',

          alignItems: 'center'
        }
      }
    >
      <WatchCarousel
        videos={pinned}
        header={
          (
            <h2>
              Featured Shows & Movies
            </h2>
          )
        }
        onClickPlay={
          (video) => setVideo(video)
        }
      />
      
      <WatchCarousel
        videos={upcoming}
        header={
          (
            <h2>
              Upcoming Shows & Movies
            </h2>
          )
        }
        onClickPlay={
          (video) => setVideo(video)
        }
      />

      <MovieDrawer
        video={video as IVideoData}
        onClose={
          () => {
            setVideo(null)
            setSeason(0)

            videoRef?.current.pause()
          }
        }
        videoRef={videoRef}
        season={season}
        onMenuClick={
          (menu) => setSeason(
            Number(menu.key)
          )
        }
      />

      <div
        style={
          {
            display: 'flex',
            flexDirection: 'column',

            flexWrap: 'wrap',
            justifyContent: 'center',

            alignItems: 'center',
            gap: '5px'
          }
        }
      >
        <h2 className='header'>
          Shows and Movies
        </h2>

        { /* Dispaly videos here*/ }
        <div
          style={
            {
              display: 'flex',
              flexDirection: 'row',

              justifyContent: 'center',
              alignItems: 'center',

              gap: '10px',
              flexWrap: 'wrap',

              maxWidth: `${170 * 5 + (170 / 2)}px`
            }
          }
        >
          {
            videosInPage.length < 1 ? (
              'Nothing to see here'
            ) : (
              videosInPage.map(
                (video, key) => (
                  <div
                    key={key}
                    className='poster-container'
                  >
                    <div className='poster'>
                      <SkeletonImage
                        style={
                          (video.lock && Date.now() < video.lock.until ||
                            !video.available ||
                            video.misc?.upcoming) ? (
                              {
                                cursor: 'not-allowed',
                                filter: 'grayscale(100%)'
                              }
                            ) : undefined
                        }
                        width={170}
                        height={250}
                        src={video.images?.poster ?? ''}
                        alt={video.meta.title}
                        onClick={
                          () => {
                            if (
                              video.lock && Date.now() < video.lock.until ||
                              !video.available ||
                              video.misc?.upcoming
                            ) return

                            setVideo(video)
                          }
                        }
                      />
                    </div>
                  </div>
                )          
              )
            )
          }
        </div>

        <div
          style={
            {
              display: 'flex',
              flexDirection: 'row',
              
              gap: '10px',
              flexWrap: 'wrap',

              marginBottom: '10px'
            }
          }
        >
          <Button
            disabled={page <= 1}
            color='red'
            onClick={
              async () => {
                if (page <= 1) return

                setPage(page - 1)
                const videos = await getVideos(page - 1)

                setVideosInPage(videos)
              }
            }
          >
            Previous
          </Button>
          <Button
            disabled={videosInPage.length < 10}
            color='green'
            onClick={
              async () => {
                if (videosInPage.length < 10) return

                setPage(page + 1)
                const videos = await getVideos(page + 1)

                setVideosInPage(videos)
              }
            }
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  try {
    const videos: IVideoData[] = (
        await (
          await fetch(`${reqUrl}?limit=10`)
        ).json()
      ).data ?? [],
    misc: IVideoData[] = (
        await (
          await fetch(`${reqUrl}?pinned=true&upcoming=true`)
        ).json()
      ).data ?? []

    return {
      props: {
        videos,
        upcoming: misc.filter(
          (vid) => vid.misc?.upcoming
        ),
        pinned: misc.filter(
          (vid) => vid.misc?.pinned
        )
      }
    }
  } catch {
    return {
      props: { videos: [], upcoming: [], pinned: [] }
    }
  }
}

export default WatchPage
import { NextPage } from 'next'
import {
  IVideoData
} from '../src/types'

import WatchCarousel from '../components/WatchCarousel'
import { useEffect, useRef, useState } from 'react'

import MovieDrawer from '../components/MovieDrawer'

import { Alert, Image, Spin } from 'antd'
import { Loading3QuartersOutlined, VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons'

const reqURL = `${process.env.API_HOST}/videos`

interface IApiVideoData {
  videos: IVideoData[]
  upcoming: IVideoData[]
  pinned: IVideoData[]
  recent: IVideoData[]
}

const WatchPage: NextPage<IApiVideoData> = ({ videos, upcoming, pinned, recent }) => {
  const [video, setVideo] = useState<IVideoData | null>(null),
    videoRef = useRef() as any,
    [season, setSeason] = useState<number>(0),
    [page, setPage] = useState<number>(1),
    [videosInPage, setVideosInPage] = useState<IVideoData[]>(videos),
    [isLoadingVideos, setIsLoadingVideos] = useState(true)

  const getVideos = async (page: number, limit = 10) => {
    const skip = (page - 1) * limit,
      videos: IVideoData[] = (
        await (
          await fetch(`${reqURL}?skip=${skip}&limit=${limit}`)
        ).json() as any
      ).data ?? []

    return videos
  }

  useEffect(
    () => {
      setIsLoadingVideos(false)
    },
    []
  )

  return (
    <div
      style={
        {
          display: 'flex',
          flexDirection: 'column',

          gap: '50px',
          justifyContent: 'center',

          alignItems: 'center',
          marginTop: '10px'
        }
      }
    >
      {
        process.env.WARNING_MSG?.length ?? 0 > 0 ? (
          <div>
            <Alert
              message='Warning'
              description={process.env.WARNING_MSG}
              type='warning'
              showIcon
            />
          </div>
        ) : null
      }

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
        videos={recent}
        header={
          (
            <h2>
              Recently Added Shows & Movies
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
            !isLoadingVideos ? (
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
                        <Image
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
                          preview={false}
                          width={170}
                          height={250}
                          src={video.images?.poster ?? ''}
                          alt={video.meta.title}
                          loading='lazy'
                          fallback='/images/failed.png'
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
            ) : (
              <Spin
                indicator={
                  <Loading3QuartersOutlined
                    spin
                    style={{ fontSize: '32px' }}
                  />
                }
              />
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

              marginBottom: '10px',
              fontSize: '24px'
            }
          }
        >
          <VerticalRightOutlined
            disabled={page <= 1}
            style={{ cursor: page <= 1 || isLoadingVideos ? 'not-allowed' : 'pointer' }}
            color='red'
            onClick={
              async () => {
                if (page <= 1) return

                setIsLoadingVideos(true)
                setPage(page - 1)

                const videos = await getVideos(page - 1)

                setIsLoadingVideos(false)
                setVideosInPage(videos)
              }
            }
          >
            Previous
          </VerticalRightOutlined>
          <VerticalLeftOutlined
            disabled={videosInPage.length < 10}
            style={{ cursor: videosInPage.length < 10 || isLoadingVideos ? 'not-allowed' : 'pointer' }}
            color='green'
            onClick={
              async () => {
                if (videosInPage.length < 10) return

                setIsLoadingVideos(true)
                setPage(page + 1)
                
                const videos = await getVideos(page + 1)

                setIsLoadingVideos(false)
                setVideosInPage(videos)
              }
            }
          >
            Next
          </VerticalLeftOutlined>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  try {
    const videos: IVideoData[] = (
        await (
          await fetch(`${reqURL}?limit=10`)
        ).json()
      ).data ?? [],
      misc: IVideoData[] = (
          await (
            await fetch(`${reqURL}?pinned=true&upcoming=true`) // fetch all pinned and upcoming
          ).json()
        ).data ?? [],
      recent: IVideoData[] = (
        await (
          await fetch(`${reqURL}?recently_added=true`)
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
        ),
        recent
      }
    }
  } catch {
    return {
      props: { videos: [], upcoming: [], pinned: [] }
    }
  }
}

export default WatchPage
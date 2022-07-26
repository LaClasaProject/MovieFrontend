import { NextPage } from 'next'
import {
  IVideoDataV2
} from '../../src/types'

import WatchCarousel from '../../components/WatchCarousel'
import { useEffect, useRef, useState } from 'react'

import V2WatchCss from '../../styles/v2/watch.module.css'
import {
  Button,
  Drawer,
  Dropdown,
  Menu
} from 'antd'

import { DownOutlined } from '@ant-design/icons'

interface IApiVideoData {
  videos: IVideoDataV2[]
}

const WatchPage: NextPage<IApiVideoData> = ({ videos }) => {
  const [video, setVideo] = useState<IVideoDataV2 | null>(null),
    [innerWidth, setInnerWidth] = useState(1024),
    videoRef = useRef() as any,
    [season, setSeason] = useState<number | null>(null)

  useEffect(
    () => {
      setInnerWidth(window.innerWidth)
    },
    []
  )

  return (
    <>
    
      <WatchCarousel
        videos={videos}
        header={
          (
            <h2>
              Top 5 of the Day
            </h2>
          )
        }
        onClickPlay={
          (video) => setVideo(video)
        }
      />

      <Drawer
        title={video?.MetaTitle ?? ''}
        closable={true}
        onClose={
          () => {
            videoRef?.current.contentWindow.postMessage(
              JSON.stringify(
                { event: 'command', func: 'stopVideo' }
              ),
              '*'
            )

            setVideo(null)
            setSeason(null)
          }
        }
        visible={!!video}
        width={innerWidth > 768 ? 640 : '90%'}
      >
        <div
          style={
            {
              display: 'flex',
              flexDirection: 'column',

              gap: '10px'
            }
          }
        >
          <div
            className={V2WatchCss['iframe-container']}
          >
            <iframe
              className={V2WatchCss['reponsive-iframe']}
              ref={videoRef}
              src={(video?.TrailerUrl ?? '') + '?enablejsapi=1&autoplay=1'}
              title='YouTube video player'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </div>

          <div className='divider' />

          <div>
            {video?.MetaDesc ?? 'No description provided.'}
          </div>

          <div className='divider' />

          {
            video?.IsSeries ? (
              <div
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',

                    flexWrap: 'wrap',
                    gap: '20px'
                  }
                }
              >
                <div>
                  <Dropdown
                    trigger={
                      ['click']
                    }
                    arrow
                    overlay={
                      (
                        <Menu
                          className={
                            V2WatchCss['menu-design']
                          }
                          onClick={
                            (menu) => {
                              setSeason(
                                Number(menu.key)
                              )
                            }
                          }
                          items={
                            Array.from(
                              { length: video?.Seasons as number },
                              (_, k) => (
                                {
                                  label: `Season ${k + 1}`,
                                  key: (k + 1).toString()
                                }
                              )
                            )
                          }
                        />
                      )
                    }
                  >
                    <div>
                      <Button
                        className={
                          V2WatchCss['dropdown-button']
                        }
                      >
                        List of Seasons
                        <DownOutlined />
                      </Button>
                    </div>
                  </Dropdown> 
                </div>

                <div>
                  {
                    (season ?? 0) > 0 ? (
                      (
                        () => {
                          // TODO: Finish episode selection & add movie support
                          const currSeason = season as number - 1,
                            episodeCount = (video.Episodes as number[])[currSeason],
                            episodes = Array.from(
                              { length: episodeCount },
                              (_, k) => {
                                const data = Array.isArray(video.EpisodesData) ? (
                                  video.EpisodesData[currSeason][k]
                                ) || null : null

                                return {
                                  ep: k + 1,
                                  title: data?.title,
                                  desc: data?.description
                                }
                              }
                            )
                          
                          return (
                            <div
                              style={
                                {
                                  display: 'flex',
                                  flexDirection: 'column',

                                  flexWrap: 'wrap'
                                }
                              }
                            >
                              {
                                episodes.map(
                                  (ep, key) => (
                                    <div
                                      key={key}
                                    >
                                      Episode {ep.ep}
                                    </div>
                                  )
                                )
                              }
                            </div>
                          )
                        }
                      )()
                    ) : null
                  }
                </div>
              </div>
            ) : (
              null
            )
          }
        </div>
      </Drawer>
    
    </>
  )
}

const getServerSideProps = async () => {
  let res: { data: IVideoDataV2[], code?: number }

  try {
    res = await (
      await fetch(`${process.env.API_HOST}/api/v2/videos`)
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
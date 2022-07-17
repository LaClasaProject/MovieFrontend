import type { NextPage } from 'next'
import fetch from 'node-fetch'

import { IVideoData } from '../types'

import { Dispatch, SetStateAction, useState, useEffect } from 'react'
import SkeletonImage from '../components/SkeletonImage'

import {
  Modal,
  Tag,
  Dropdown,
  Button,
  Menu
} from 'antd'

import type { MenuProps } from 'antd'
import { DownOutlined } from '@ant-design/icons'

interface IApiVideoData {
  videos: IVideoData[]
}

const Home: NextPage<IApiVideoData> = (props) => {
  const videoDialogStates: {
    [key: string]: [boolean, Dispatch<SetStateAction<boolean>>]
  } = {}

  const [currSeason, setCurrSeason] = useState<{
      season: number
      episodes: number
      id: string
    } |
    null
  >(null)

  const closeModal = (videoId: string) => {
    videoDialogStates[videoId][1](false)
    setCurrSeason(null)
  }

  const onClickMenu: MenuProps['onClick'] = (props) => {
    const [
      id,
      season,
      episodes
    ] = props.key.split('_')

    setCurrSeason(
      {
        id,
        season: Number(season),
        episodes: Number(episodes)
      }
    )
  }

  return (
    <div className='flex col wrap'>
      <h1 className='header'>
        Collection of Movies & Series
      </h1>

      <div className='movie parent'>
        {
          props.videos.map(
            (video, key) => {
              videoDialogStates[video.VideoId] = useState(false)

              return (
                <div key={key}>
                  {
                    videoDialogStates[video.VideoId][0] ? (
                      <Modal
                        visible={
                          videoDialogStates[video.VideoId][0]
                        }
                        onOk={
                          () => {
                            closeModal(video.VideoId)
                          }
                        }
                        onCancel={
                          () => {
                            closeModal(video.VideoId)
                          }
                        }
                        style={
                          {
                            maxWidth: '480px'
                          }
                        }
                      >
                        <div
                          className='flex col wrap'
                          style={
                            {
                              justifyContent: 'center',
                              alignItems: 'center'
                            }
                          }
                        >
                          <div>
                            <h2 className='header'>
                              {video.MetaTitle}
                            </h2>
                          </div>

                          <div>
                            <SkeletonImage
                              width={240}
                              height={120}
                              src={video.CoverUrl}
                              alt={`${video.MetaTitle} cover photo.`}
                            />
                          </div>
                        </div>

                        <div>
                          {video.MetaDesc}
                        </div>

                        <div
                          className='flex row wrap'
                          style={
                            {
                              gap: '6px'
                            }
                          }
                        >
                          <div>
                            <h3>
                              Available Seasons
                            </h3>
                          </div>

                          <div
                            style={
                              {
                                marginTop: '3px'
                              }
                            }
                          >
                            {
                              video.IsAvailable ? (
                                <Tag
                                  color='success'
                                >
                                  Available
                                </Tag>
                              ) : (
                                <Tag
                                  color='error'
                                >
                                  Unavailable
                                </Tag>
                              )
                            }
                          </div>
                        </div>

                        <div
                          className='flex col wrap'
                          style={
                            {
                              gap: '10px'
                            }
                          }
                        >
                          <div>
                            <Dropdown
                              disabled={!video.IsAvailable}
                              overlay={
                                <Menu
                                  onClick={onClickMenu}
                                  items={
                                    (
                                      () => {
                                        const seasons = [],
                                          seasonCount = video.Seasons ?? 0
          
                                        for (let i = 0; i < seasonCount; i++)
                                          seasons.push(
                                            {
                                              label: `Season ${i + 1}`,
                                              key: video.VideoId + '_' + (i + 1 ) + '_' + video.Episodes?.data[i] ?? 0
                                            }
                                          )
                                        
                                        return seasons
                                      }
                                    )()
                                  }
                                />
                              }
                            >
                              <Button
                                icon={
                                  <DownOutlined />
                                }
                              >
                                {
                                  currSeason?.season ? (
                                    `Season ${currSeason.season}`
                                  ) : 'Select Season'
                                }
                              </Button>
                            </Dropdown>
                          </div>

                          {
                            currSeason !== null && currSeason.id === video.VideoId ? (
                              () => {
                                const elements = []

                                for (let i = 0; i < currSeason.episodes; i++)
                                  elements.push(
                                    <Button
                                      key={i}
                                      onClick={
                                        () => window.location.href=`/watch/${video.VideoId}?s=${currSeason.season}&e=${i + 1}`
                                      }
                                    >
                                      {
                                        `Episode ${(i + 1).toString()}`
                                      }
                                    </Button>
                                  )

                                return (
                                  <div
                                    className='flex row wrap'
                                    style={
                                      {
                                        gap: '5px'
                                      }
                                    }
                                  >
                                    {elements}
                                  </div>
                                )
                              }
                            )() : null
                          }
                        </div>
                      </Modal>
                    ) : null
                  }
  
                  <div
                    className='container'
                  >
                    <div className='poster'>
                      <SkeletonImage
                        width={220}
                        height={340}
                        src={video.PosterUrl ?? ''}
                        alt={video.MetaTitle}
                        onClick={
                          () => {
                            if (!video.IsSeries)
                              window.location.href = `/watch/${video.VideoId}`
                            else {
                              videoDialogStates[video.VideoId][1](true)
                            }
                          }
                        }
                      />
                    </div> 
                  </div>
                </div>
              )
            }
          )
        }
      </div>
    </div>
  )
}

const getServerSideProps = async () => {
  let res: { data: IVideoData[], code?: number }

  try {
    res = await (
      await fetch(`${process.env.API_HOST}/videos`)
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

export { getServerSideProps }

export default Home
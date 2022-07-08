import type { NextPage } from 'next'
import fetch from 'node-fetch'

import { IVideoData } from '../types'
import { Tag } from 'primereact/tag'

import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'

import { Dispatch, SetStateAction, useState } from 'react'
import SkeletonImage from '../components/SkeletonImage'

import { Button } from 'primereact/button'

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

  return (
    <>
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
                  <Dialog
                    visible={
                      videoDialogStates[video.VideoId][0]
                    }
                    onHide={
                      () => {
                        videoDialogStates[video.VideoId][1](false)
                        setCurrSeason(null)
                      }
                    }
                    header={video.MetaTitle}
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
                      <SkeletonImage
                        width={240}
                        height={120}
                        src={video.CoverUrl}
                        alt={`${video.MetaTitle} cover photo.`}
                      />
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
                            marginTop: 'auto',
                            marginBottom: 'auto'
                          }
                        }
                      >
                        {
                          video.IsAvailable ? (
                            <Tag
                              severity='success'
                              rounded
                            >
                              Available
                            </Tag>
                          ) : (
                            <Tag
                              severity='danger'
                              rounded
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
                      <Dropdown
                        key={key}
                        value={currSeason}
                        disabled={!video.IsAvailable}
                        placeholder='List of available seasons'
                        style={
                          {
                            width: '240px'
                          }
                        }
                        onChange={
                          (e) => setCurrSeason(e.value)
                        }
                        options={
                          (
                            () => {
                              const seasons = [],
                                seasonCount = video.Seasons ?? 0

                              for (let i = 0; i < seasonCount; i++)
                                seasons.push(
                                  {
                                    label: `Season ${i + 1}`,
                                    value: {
                                      id: video.VideoId,
                                      season: i + 1,
                                      episodes: video.Episodes?.data[i] ?? 0
                                    }
                                  }
                                )
                              
                              return seasons
                            }
                          )()
                        }
                      />

                      {
                        currSeason !== null && currSeason.id === video.VideoId ? (
                          () => {
                            const elements = []

                            for (let i = 0; i < currSeason.episodes; i++)
                              elements.push(
                                <Button
                                  key={i}
                                  label={
                                    `Episode ${(i + 1).toString()}`
                                  }
                                  className='p-button-sm p-button-raised p-button-info p-button-text'
                                  icon='pi pi-caret-right'
                                  iconPos='right'
                                  onClick={
                                    () => window.location.href=`/watch/${video.VideoId}?s=${currSeason.season}&e=${i + 1}`
                                  }
                                />
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
                  </Dialog>
  
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
    </>
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
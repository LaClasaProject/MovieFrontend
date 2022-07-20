import { GetServerSidePropsContext } from 'next'
import { IVideoData } from '../../types'

import fetch from 'node-fetch'
import { useEffect, useState } from 'react'

import { Button } from 'antd'
import Router from 'next/router'

import {
  HomeOutlined,
  StepBackwardOutlined,
  StepForwardOutlined
} from '@ant-design/icons'

interface Buf {
  data: number[]
  type: 'Buffer'
}

const WatchVideo = (
  props: {
    videoId: string
    season: string
    episode: string,
    data?: IVideoData
  }
) => {
  const [currSeason, setSeason] = useState(
      Number(props.season)
    ),
    [currEpisode, setEpisode] = useState(
      Number(props.episode)
    )

    const nextButtonCheck = props.data?.IsSeries ? (
        currEpisode >= (
          (props.data?.Episodes as any).data[currSeason - 1] as number
        ) &&
        currSeason === props.data?.Seasons as number
      ) : true,
      prevButtonCheck = props.data?.IsSeries ? (
        props.data?.IsSeries && (
          currSeason === 1 && currEpisode === 1
        )
      ) : true

  const [disableNextButton, setDisableNextButton] = useState(nextButtonCheck),
    [disablePrevButton, setDisablePrevButton] = useState(prevButtonCheck)

  useEffect(
    () => {
      setDisableNextButton(nextButtonCheck)
      setDisablePrevButton(prevButtonCheck)
    },
    [nextButtonCheck, prevButtonCheck]
  )

  const nextEpisode = () => {
    if (!props.data?.Episodes) return

    let newEpisode: number,
      newSeason: number

    setDisablePrevButton(false)

    if (currEpisode >= props.data?.Episodes.data[currSeason - 1]) {
      if (currSeason >= (props.data.Seasons as number))
        return Router.push('/')

      newSeason = currSeason + 1
      newEpisode = 1
    } else {
      newSeason = currSeason
      newEpisode = currEpisode + 1
    }

    if (newEpisode === props.data?.Episodes.data[currSeason - 1] &&
        currSeason >= (props.data.Seasons as number))
          setDisableNextButton(true)

    setSeason(newSeason)
    setEpisode(newEpisode)

    // update url
    Router.push(
      {
        pathname: `/watch/${props.videoId}`,
        query: {
          s: newSeason,
          e: newEpisode
        }
      }, 
      undefined,
      { shallow: false }
    )
  }

  const prevEpisode = () => {
    const episodes: Buf = props.data?.Episodes as any

    let newSeason: number,
        newEpisode: number

    setDisableNextButton(false)

    if (currEpisode === 1) {
      if (currSeason === 1)
        return Router.push('/')

      newSeason = currSeason - 1
      newEpisode = episodes.data[newSeason - 1]
    } else {
      newSeason = currSeason
      newEpisode = currEpisode - 1
    }

    if (newEpisode === 1 && newSeason === 1)
      setDisablePrevButton(true)

    setSeason(newSeason)
    setEpisode(newEpisode)
      

    // update url
    Router.push(
      {
        pathname: `/watch/${props.videoId}`,
        query: {
          s: newSeason,
          e: newEpisode
        }
      }, 
      undefined,
      { shallow: true }
    )
  }

  return props.data ? (
    <div
      className='flex col wrap'
      style={
        {
          justifyContent: 'center',
          alignItems: 'center',

          textAlign: 'center',
          gap: '30px'
        }
      }
    >
      <div
        className='flex row wrap'
        style={
          {
            justifyContent: 'center',
            alignItems: 'center',

            gap: '10px'
          }
        }
      >
        <div
          style={
            {
              marginTop: 'auto',
              marginBottom: 'auto'
            }
          }
        >
          <Button
            onClick={
              () => Router.push('/')
            }
            type='primary'
            shape='circle'
            icon={
              <HomeOutlined/>
            }
          />
        </div>
          

        <div>
          <h2>
            {props.data.MetaTitle} {
              props.data.IsSeries ? (
                `Season ${currSeason} Episode ${currEpisode}`
              ) : null
            }
          </h2>
        </div>
      </div>

      <div>  
        <video
          className='video-js'
          controls
          autoPlay
          style={
            {
              maxWidth: '1080px',
              maxHeight: '1920px'
            }
          }
          height={1920}
          width={1080}
          poster={props.data.CoverUrl ?? ''}
          controlsList='nodownload'
          onContextMenu={
            (e) => e.preventDefault()
          }
          src={
            props.data.VideoUrl ? (
              props.data.IsSeries ? (
                props.data.VideoUrl.split('.mp4')[0] +
                  `/S${currSeason}/E${currEpisode}` +
                  '.mp4'
              ) : props.data.VideoUrl
            ) : (
              `${process.env.API_HOST}/video/${props.videoId}?s=${currSeason}&e=${currEpisode}`
            )
          }
        >
          {
            /* Support english for now */

            props.data.SubtitlePath ? (
              <track
                src={
                  props.data.IsSeries ? (
                    `${props.data.SubtitlePath}/S${currSeason}/E${currEpisode}.vtt`
                  ) : props.data.SubtitlePath
                }
                label='English'
                kind='captions'
                srcLang='en'
                default
              >
              </track>
            ) : null
          }
        </video>
      </div>

      <div
        className='flex row wrap'
        style={
          {
            gap: '10px'
          }
        }
      >
        <div
          style={
            {
              textAlign: 'center'
            }
          }
        >
          <Button
            disabled={disablePrevButton}
            onClick={prevEpisode}
            icon={
              <StepBackwardOutlined />
            }
            style={
              {
                backgroundColor: '#ff6565'
              }
            }
          />
        </div>

        <div>
          <Button
            disabled={disableNextButton}
            onClick={nextEpisode}
            icon={
              <StepForwardOutlined />
            }
            style={
              {
                backgroundColor: '#8eff65'
              }
            }
          />
        </div>
      </div>

      <script
        src='https://vjs.zencdn.net/7.20.1/video.min.js'
      />
    </div>
  ) : (
    <div>
      <h1>This video does not exist.</h1>
    </div>
  )
}

const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const {
    s: season,
    e: episode,
    videoId
  } = context.query

  // get video data
  let res: { data?: IVideoData, code?: number }

  try {
    res = await (
      await fetch(
        `${process.env.API_HOST}/videos/${videoId}`
      )
    )?.json() as any
  } catch {
    res = {}
  }

  return {
    props: {
      season: isNaN(season as any) ? '1' : season,
      episode: isNaN(episode as any) ? '1' : episode,
      videoId,
      data: res.data
    }
  }
}

export { getServerSideProps }

export default WatchVideo

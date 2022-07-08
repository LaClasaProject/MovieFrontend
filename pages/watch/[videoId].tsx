import { GetServerSidePropsContext } from 'next'
import Plyr from 'plyr-react'

import { IVideoData } from '../../types'
import fetch from 'node-fetch'

import { useEffect, useState } from 'react'
import { Button } from 'primereact/button'

import Router from 'next/router'

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
    []
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
      { shallow: true }
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
            icon='pi pi-home'
            className='p-button-rounded p-button-info'
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
        <Plyr
          options={
            {
              autoplay: true
            }
          }
          source={
            {
              poster: props.data.CoverUrl,
              type: 'video',
              sources: [
                {
                  src: `${process.env.API_HOST}/video/${props.videoId}?s=${currSeason}&e=${currEpisode}`,
                  type: 'video/mp4'
                }
              ]
            }
          }
        />
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
            icon='pi pi-arrow-left'
            className='p-button-rounded p-button-danger'
          />
        </div>

        <div>
          <Button
            disabled={disableNextButton}
            onClick={nextEpisode}
            icon='pi pi-arrow-right'
            className='p-button-rounded p-button-success'
          />
        </div>
      </div>
    </div>
  ) : (
    <div>
      <h1>This video does not exist.</h1>
    </div>
  )
}

const getServerSideProps = async (context: GetServerSidePropsContext) => {
  console.log(context)

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
import { GetServerSidePropsContext } from 'next'
import { ISeriesData, IVideoData } from '../../src/types'

import Video from '../../components/Video'
import { useEffect, useState } from 'react'

const WatchVideo = (
  props: {
    season: string
    episode: string,
    data: IVideoData
  }
) => {
  const [currentEpisode, setCurrentEpisode] = useState(Number(props.episode)),
    [currentSeason, setCurrentSeason] = useState(Number(props.season)),
    [hasLoaded, setHasLoaded] = useState(false),
    [videoUrl, setVideoUrl] = useState(''),
    [captionUrl, setCaptionUrl] = useState(''),
    [videoTitle, setVideoTitle] = useState(''),
    videoSubtitle = props.data.series ? (
        props.data.meta?.title ?? ''
      ) : ''

  const getVideoUrl = () => {
    if (props.data.trailer?.show && props.data.trailer?.url)
      return props.data.trailer?.url

    const series = props.data.series

    if (series) {
      return (props.data.misc?.video ?? '') +
        `/S${currentSeason}/E${currentEpisode}` +
        '.mp4'
    } else return (props.data.misc?.video ?? '') + '/video.mp4'
  },
    getCaptionUrl = () => {
      const subPath = `/S${currentSeason}/E${currentEpisode}`,
        url = props.data.misc?.subs ?? ''

      if (!props.data.series)
        return url
      else return url + subPath
    },
    getVideoTitle = () => {
      if (!props.data.series) return props.data.meta?.title
      else {
        const pattern = 'S{season}:E{episode} "{title}"',
          episode = props.data.series.episodes[currentSeason - 1][currentEpisode - 1]

        return pattern.replace(
            '{season}',
            currentSeason.toString()
          )
          .replace(
            '{episode}',
            currentEpisode.toString()
              .padStart(2, '0')
          )
          .replace(
            '{title}',
            episode.title ?? ''
          )
      }
    },
    checkEpisodeValidity = (series: ISeriesData) => {
      if (currentSeason > series.seasons) return false
      else {
        const season = series.episodes[currentSeason - 1]
        if (!season || !season[currentEpisode - 1]) return false
        else return true
      }
    },
    nextEpisode = () => {
      const series = props.data.series
      if (
        !series || (
          currentSeason >= series.seasons &&
          currentEpisode >= series.episodes[currentSeason - 1].length
        )
      ) return // disallow movies, last episode at last season

      const season = series.episodes[currentSeason - 1]
      if (currentEpisode >= season.length) { // last episode
        setCurrentSeason(currentSeason + 1)
        setCurrentEpisode(1)
      } else setCurrentEpisode(currentEpisode + 1)
    },
    previousEpisode = () => {
      const series = props.data.series
      if (
        !series || (
          currentSeason <= 1 &&
          currentEpisode <= 1
        )
      ) return // disallow movies, first episode at first season

      if (currentEpisode <=  1) { // first episode
        setCurrentSeason(currentSeason - 1)
        setCurrentEpisode(series.episodes[currentSeason - 1].length)
      } else setCurrentEpisode(currentEpisode - 1)
    }
  useEffect(
    () => {
      // series check
      const series = props.data.series
      if (series && !checkEpisodeValidity(series)) {
        setCurrentEpisode(1)
        setCurrentSeason(1)
      }

      setHasLoaded(true)
      setVideoUrl(getVideoUrl())

      setCaptionUrl(getCaptionUrl())
      setVideoTitle(getVideoTitle())
    },
    []
  )

  useEffect(
    () => {
      setVideoUrl(getVideoUrl())
      setCaptionUrl(getCaptionUrl())

      setVideoTitle(getVideoTitle())
    },
    [currentEpisode, currentSeason]
  )

  return hasLoaded ? (
    <Video
      autoFullScreen
      autoPlay
      
      src={videoUrl}
      subtitle={videoSubtitle}

      onNext={nextEpisode}
      onPrevious={previousEpisode}

      captions={captionUrl}
      title={videoTitle}
    />
  ) : null
}

const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const {
    s: season,
    e: episode,
    id
  } = context.query

  // get video data
  let res: { data?: IVideoData, code?: number }

  try {
    res = await (
      await fetch(
        `${process.env.API_HOST}/video/${id}`
      )
    )?.json() as any
  } catch {
    res = {}
  }

  return {
    props: {
      season: isNaN(season as any) ? '1' : season,
      episode: isNaN(episode as any) ? '1' : episode,
      data: res.data ?? {}
    }
  }
}

export { getServerSideProps }

export default WatchVideo

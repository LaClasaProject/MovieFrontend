import { GetServerSidePropsContext } from 'next'
import { IVideoData } from '../../src/types'

import Video from '../../components/Video'
import { useEffect, useState } from 'react'

const WatchVideo = (
  props: {
    season: string
    episode: string,
    data?: IVideoData
  }
) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null),
    [currSeason, setCurrSeason] = useState(Number(props.season)),
    [currEpisode, setCurrEpisode] = useState(Number(props.episode)),
    [videoTitle, setVideoTitle] = useState(''),
    buildVideoUrl = () => {
      if (props.data?.misc?.upcoming) {
        if (props.data?.trailer?.show)
          return props.data?.trailer.url
        else return ''
      } else {
        const url = props.data?.misc?.video ?? ''
        if (!url) return ''

        if (props.data?.series)
          return url + `/S${currSeason}/E${currEpisode}.mp4`
        else return url + '/video.mp4'
      }
    },
    getVideoTitle = () => {
      if (props.data?.series)
        return `S${currSeason}:E${currEpisode} "` + (
          props.data?.series.episodes[currSeason - 1][currEpisode - 1]?.title ?? ''
        ).trim() + '"'
      else props.data?.meta.title
    },
    onPrevious = () => {
      const seasonIndex = currSeason - 1,
        episodeIndex = currEpisode - 1,
        seasons = props.data?.series?.episodes ?? [],
        season = seasons[seasonIndex] ?? []

      if (episodeIndex < 1) { // at the first episode of the season
        if (seasonIndex < 1) return // at the first season
        else {
          console.log('ree')

          setCurrSeason(currSeason - 1)
          setCurrEpisode(seasons[seasonIndex - 1].length - 1) // get last episode index
        }
      } else setCurrEpisode(currEpisode - 1) // not at the first episode
    },
    onNext = () => {
      const seasonIndex = currSeason - 1,
        episodeIndex = currEpisode - 1,
        seasons = props.data?.series?.episodes ?? [],
        season = seasons[seasonIndex] ?? []

      if (episodeIndex >= season.length - 1) { // at the last episode of the season
        if (seasonIndex >= seasons.length - 1) return // at the last season
        else {
          setCurrSeason(currSeason + 1)
          setCurrEpisode(1)
        }
      } setCurrEpisode(currEpisode + 1)  // not at the last episode of the season
    }

  useEffect(
    () => {
      const url = buildVideoUrl(),
        title = getVideoTitle() ?? ''
                
      setVideoUrl(url)
      setVideoTitle(title)
    },
    [currEpisode, currSeason]
  )

  return (
    <div>
      <Video
        src={videoUrl ?? ''}
        autoPlay
        autoFullScreen
        title={videoTitle}
        onPrevious={onPrevious}
        onNext={onNext}
        subtitle={props.data?.misc?.subs}
      />
    </div>
  )  
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
      data: res.data
    }
  }
}

export { getServerSideProps }

export default WatchVideo
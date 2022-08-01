import { GetServerSidePropsContext } from 'next'
import { IVideoData } from '../../../src/types'

const IosVideo = (
  props: {
    season: string
    episode: string,
    data: IVideoData
  }
) => {
  const getVideoUrl = () => {
      if (props.data.trailer?.show && props.data.trailer?.url)
        return props.data.trailer?.url

      const series = props.data.series

      if (series) {
        return (props.data.misc?.video ?? '') +
          `/S${props.season}/E${props.episode}` +
          '.mp4'
      } else return (props.data.misc?.video ?? '') + '/video.mp4'
    },
    getCaptionUrl = () => {
      const subPath = `/S${props.season}/E${props.episode}`,
        url = props.data.misc?.subs ?? ''

      if (!props.data.series)
        return url
      else return url + subPath
    }

  return (
    <div className='video-content'>
      <video
        autoPlay
        className='fullscreen-video ios-video'

        src={getVideoUrl()}
        
        controls
        controlsList='nodownload'

        onContextMenu={(ev) => ev.preventDefault()}
        crossOrigin='anonymous'
      >
        { /* todo add option for subtitles */ }
        <track
          default
          src={getCaptionUrl() + '/english.vtt'}
          kind='captions'
          srcLang='en'
        />
      </video>
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
      data: res.data ?? {}
    }
  }
}

export { getServerSideProps }

export default IosVideo
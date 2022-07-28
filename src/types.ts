// Types from MovieBackend

interface IEpisodeData {
  title: string
  desc?: string

  thumbnail?: string
}

interface ISeriesData {
  seasons: number
  episodes: IEpisodeData[][]
}

interface IVideoMeta {
  title: string
  desc?: string
}

interface ITrailerData {
  show?: boolean
  url: string
}

interface ILockData {
  until: number
  hide?: boolean
}

interface IVideoImageData {
  poster?: string
  cover?: string

  thumbnail: string
}

interface IVideoMiscData {
  video?: string
  subs?: string

  pinned?: boolean
  upcoming?: boolean
}

interface IVideoData {
  _id: string

  addedAt?: number
  available?: boolean

  series?: ISeriesData
  meta: IVideoMeta

  trailer?: ITrailerData
  lock?: ILockData
  
  runtime?: number
  images?: IVideoImageData

  misc?: IVideoMiscData
}

export type {
  ISeriesData,
  IEpisodeData,

  IVideoMeta,
  ITrailerData,

  ILockData,
  IVideoData,

  IVideoImageData,
  IVideoMiscData
}
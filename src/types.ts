// remove soon
interface IVideoData {
  VideoId: string
  IsSeries: boolean
  
  MetaTitle: string
  MetaDesc: string

  Seasons?: number
  Episodes?: {
    data: number[]
    type: 'Buffer'
  }

  PosterUrl?: string
  CoverUrl?: string

  IsAvailable: boolean
  VideoUrl?: string

  AddedAt: number
  SubtitlePath?: string
}

interface IVideoDataV2 {
  VideoId: string
  AddedAt: number

  IsAvailable?: boolean
  IsSeries?: boolean

  ThumbnailUrl?: string
  CoverUrl?: string

  VideoUrl?: string
  SubsPath?: string

  Seasons?: number
  Episodes?: {
    data: number[]
    type: Buffer
  }

  MetaTitle: string
  MetaDesc?: string

  IsTrailer?: boolean
  LockedUntil?: number

  HideIfLocked?: boolean
  TotalRuntime: number
}

export type {
  IVideoData, // remove soon
  IVideoDataV2
}

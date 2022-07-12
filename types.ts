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
}

export type {
  IVideoData
}
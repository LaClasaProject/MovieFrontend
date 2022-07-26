import { Carousel } from 'react-responsive-carousel'
import Image from 'next/image'

import V2CarouselCss from '../styles/v2/carousel.module.css'
import {
  IVideoDataV2
} from '../src/types'

import { Tag } from 'antd'
import { PlayCircleFilled } from '@ant-design/icons'

import { convertMsToStringTime } from '../src/utils'

const WatchCarousel = (
  props: {
    videos: IVideoDataV2[],
    header: React.ReactNode,
    onClickPlay: (video: IVideoDataV2) => any
  }
) => (
  <div
    style={
      {
        display: 'flex',
        flexDirection: 'column',

        justifyContent: 'center',
        alignItems: 'center'
      }
    }
  >
    <>
      {props.header}
    </>

    <div
      className={V2CarouselCss['carousel-container']}
    >
      <Carousel
        showArrows
        infiniteLoop
        showThumbs={false}
        centerMode
        showIndicators={false}
        emulateTouch
      >
        {
          props.videos?.map(
            (video, index) => (
              <div
                key={index}
              >
                <Image
                  src={video.ThumbnailUrl ?? ''}
                  width={1920}
                  height={1080}
                />

                <div
                  className={
                    V2CarouselCss['carousel-item-data']
                  }
                >
                  <div
                    className={
                      V2CarouselCss['carousel-item-text']
                    }
                  >
                    <div
                      style={
                        {
                          display: 'flex',
                          flexDirection: 'row',

                          flexWrap: 'wrap',
                          gap: '5px'
                        }
                      }
                    >
                      <div>
                        {video.MetaTitle}
                      </div>

                      <Tag
                        color={
                          video.IsSeries ? 'red' : 'blue'
                        }
                        className={
                          V2CarouselCss['carousel-item-tag']
                        }
                      >
                        {
                          video.IsSeries ?
                            'Series' :
                            'Movie'
                        }
                      </Tag>
                    </div>

                    <div>
                      {convertMsToStringTime(video.TotalRuntime)}
                    </div>
                  </div>

                  <div
                    className={
                      V2CarouselCss['carousel-item-button']
                    }
                  >
                    <PlayCircleFilled
                      onClick={
                        () => props.onClickPlay(video)
                      }
                      className={
                        V2CarouselCss['carousel-play-button']
                      }
                    />
                  </div>
                </div>
              </div>
            )
          )
        }
      </Carousel>
    </div>
  </div>
)

export default WatchCarousel
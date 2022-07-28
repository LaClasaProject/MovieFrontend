import { Carousel } from 'react-responsive-carousel'
import Image from 'next/image'

import {
  IVideoData
} from '../src/types'

import { Tag } from 'antd'
import { PlayCircleFilled } from '@ant-design/icons'

import { convertMsToStringTime } from '../src/utils'

const WatchCarousel = (
  props: {
    videos: IVideoData[],
    header: React.ReactNode,
    onClickPlay: (video: IVideoData) => any
  }
) => (
  <div
    style={
      {
        display: 'flex',
        flexDirection: 'column',

        justifyContent: 'center',
        alignItems: 'center',

        textAlign: 'center',
      }
    }
  >
    <div className='header'>
      {props.header}
    </div>

    <div
      className='carousel-container'
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
                  src={video.images?.thumbnail ?? ''}
                  width={1920}
                  height={1080}
                />

                <div
                  className='carousel-item-data'
                >
                  <div className='carousel-item-text'>
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
                        {video.meta.title}
                      </div>

                      <Tag
                        color={
                          video.series ? 'red' : 'blue'
                        }
                        className='carousel-item-tag'
                      >
                        {
                          video.series ?
                            'Series' :
                            'Movie'
                        }
                      </Tag>
                    </div>

                    <div>
                      {convertMsToStringTime(video.runtime || 0)}
                    </div>
                  </div>

                  <div
                    className='carousel-item-button'
                  >
                    <PlayCircleFilled
                      onClick={
                        () => props.onClickPlay(video)
                      }
                      className='carousel-play-button'
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
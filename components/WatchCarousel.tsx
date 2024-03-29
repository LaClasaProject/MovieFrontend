import { Carousel } from 'react-responsive-carousel'

import {
  IVideoData
} from '../src/types'

import { Image, Tag } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

import { convertMsToStringTime } from '../src/utils'
import Button from './Button'

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

        justifyContent: 'center'
      }
    }
  >
    <div className='header'>
      {props.header}
    </div>

    <div className='carousel-container'>
      <Carousel
        showArrows
        infiniteLoop
        centerMode
        showThumbs={false}
        showIndicators={false}
        dynamicHeight={true}
        className='carousel-element'
      >
        {
          props.videos?.map(
            (video, index) => (
              <div key={index}>
                <Image
                  src={video.images?.thumbnail ?? ''}
                  alt={video.meta.title}
                  loading='lazy'
                  fallback='/images/failed.png'
                  preview={false}
                  width='100%'
                  style={
                    { minHeight: '80px' }
                  }
                />

                { /* left text */ }
                <div className='carousel-left-container'>
                  <div className='carousel-title-info'>
                    <div>
                      {video.meta.title}
                    </div>

                    <div className='carousel-title-tag'>
                      <Tag color={video.series ? 'red' : 'cyan'}>
                        {video.series ? 'Series' : 'Movie'}
                      </Tag>
                    </div>
                  </div>

                  <div>
                    {convertMsToStringTime(video.runtime ?? 0)}
                  </div>
                </div>

                { /* right data */ }
                <div className='carousel-right-container'>
                  <Button
                    color='purple'
                    onClick={() => props.onClickPlay(video)}
                    centered
                    filled
                    icon={
                      <InfoCircleOutlined />
                    }
                  >
                    More Info
                  </Button>
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
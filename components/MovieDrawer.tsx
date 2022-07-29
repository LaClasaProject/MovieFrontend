import { IVideoData } from '../src/types'
import {
  Drawer, Dropdown, Menu
} from 'antd'

import { MutableRefObject, useEffect, useState } from 'react'
import Button from './Button'

import { CaretRightFilled, DownOutlined } from '@ant-design/icons'
import Router from 'next/router'

import { MenuInfo } from 'rc-menu/lib/interface'
import Video from './Video'

const MovieDrawer = (
  { video, onClose, videoRef, season, onMenuClick }: {
    video: IVideoData
    onClose: () => void,
    videoRef: MutableRefObject<any>,
    season: number,
    onMenuClick: (menu: MenuInfo) => any
  }
) => {
  const [innerWidth, setInnerWidth] = useState(1024)

  useEffect(
    () => {
      setInnerWidth(window.innerWidth ?? 0)
    },
    []
  )

  return (
    <Drawer
      title={video?.meta.title ?? ''}
      closable={true}
      onClose={onClose}
      visible={!!video}
      width={innerWidth > 768 ? 640 : '90%'}
    >
      {
        video ? (
          <div
            style={
              {
                display: 'flex',
                flexDirection: 'column',
      
                gap: '10px'
              }
            }
          >
            <div>
              <Video
                ref={videoRef}
                autoPlay
                src={video?.trailer?.url ?? ''}
                noPip
                className='responsive-video'
                noBackButton
              />
            </div>
      
            <div className='divider' />
      
            <div
              style={
                {
                  fontSize: '18px',
                  fontFamily: "'Tako', sans-serif"
                }
              }
            >
              {video?.meta.desc ?? 'No description provided.'}
            </div>
      
            <div className='divider' />
      
            {
              video?.series ? (
                <div
                  style={
                    {
                      display: 'flex',
                      flexDirection: 'column',
      
                      flexWrap: 'wrap',
                      gap: '20px'
                    }
                  }
                >
                  <div>
                    <Dropdown
                      trigger={
                        ['click']
                      }
                      overlay={
                        (
                          <Menu
                            className='menu-design'
                            onClick={
                              (menu) => onMenuClick(menu)
                            }
                            items={
                              Array.from(
                                { length: video?.series.seasons as number },
                                (_, k) => (
                                  {
                                    label: `Season ${k + 1}`,
                                    key: (k + 1).toString()
                                  }
                                )
                              )
                            }
                          />
                        )
                      }
                    >
                      <div
                        style={{ display: 'flex' }}
                      >
                        <Button
                          disabled={!video.available}
                          color='cyan'
                        >
                          {
                            (
                              season ?
                                `Season ${season}` :
                                'List of Seasons'
                            ) + ' '
                          }
                          <DownOutlined />
                        </Button>
                      </div>
                    </Dropdown> 
                  </div>
      
                  <div>
                    {
                      (season ?? 0) > 0 ? (
                        (
                          () => {
                            const currSeason = season as number - 1,
                              episodes = video.series.episodes[currSeason]
                            
                            return (
                              <div
                                style={
                                  {
                                    display: 'flex',
                                    flexDirection: 'column',
      
                                    flexWrap: 'wrap'
                                  }
                                }
                              >
                                {
                                  episodes.map(
                                    (ep, key) => (
                                      <div
                                        onClick={
                                          () => {
                                            Router.push(
                                              season === 1 && key + 1 === 1 ? (
                                                `/watch/${video._id}`
                                              ) : (
                                                `/watch/${video._id}?s=${season}&e=${key + 1}`
                                              )
                                            )
                                          }
                                        }
                                        key={key}
                                        className='episode-info'
                                        style={
                                          {
                                            display: 'flex',
                                            flexDirection: 'column',
      
                                            flexWrap: 'wrap',
                                          }
                                        }
                                      >
                                        <div
                                          style={
                                            {
                                              fontFamily: 'Bebas Neue',
                                              fontSize: '24px'
                                            }
                                          }
                                        >
                                          E{
                                            (key + 1).toString()
                                              .padStart(2, '0')
                                          }: {ep.title ?? 'No Title Provided'}
                                        </div>
      
                                        <div
                                          style={
                                            {
                                              fontFamily: 'Lato',
                                              fontSize: '16px',
      
                                              color: '#b8b8b8'
                                            }
                                          }
                                        >
                                          {ep.desc}
                                        </div>
                                      </div>
                                    )
                                  )
                                }
                              </div>
                            )
                          }
                        )()
                      ) : null
                    }
                  </div>
                </div>
              ) : (
                <Button
                  onClick={
                    () => {
                      if (video?.available)
                        Router.push(`/watch/${video?._id}`)
                    }
                  }
                  color={video.available || !video.misc?.upcoming ? 'green' : 'red'}
                  disabled={!video.available || video.misc?.upcoming}
                >
                  <CaretRightFilled />
                  {
                    video.available || !video.misc?.upcoming ? (
                      ' Watch Now'
                    ) : ' Coming Soon'
                  }
                </Button>
              )
            }
          </div>
        ) : null
      }
    </Drawer>
  )
}

export default MovieDrawer
import { ICustomVideoProps } from '../src/types'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'

import {
  Slider, Tooltip
} from 'antd'
import moment from 'moment'

import fscreen from 'fscreen'
import {
  ArrowLeftOutlined,
  CaretRightFilled,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  PauseOutlined,
  SoundOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined
} from '@ant-design/icons'

import Router from 'next/router'

const formatNum = (value: number = 0) => moment.utc((value || 0) * 1000).format('HH:mm:ss')

const Video = forwardRef(
  (props: ICustomVideoProps, ref) => {
    const [lastMouseMove, setLastMouseMove] = useState(0),
      [controlsShown, setControlsShown] = useState(false),
      videoRef = useRef<HTMLVideoElement>(),
      [currentTime, setCurrentTime] = useState(0),
      containerRef = useRef<HTMLElement>(),
      [inFullScreen, setInFullScreen] = useState(false),
      [paused, setPaused] = useState(true),
      [volume, setVolume] = useState(1)

    const getVideo = () => {
        const video = videoRef.current
        return video
      },
      pause = async () => {
        const video = getVideo()
        if (!video) return

        if (!video.paused && !paused) {
          //setPaused(true)
          try { await video.pause() } catch {}
        }
      },
      play = async () => {
        const video = getVideo()
        if (!video) return

        if (video.paused && paused) {
          //setPaused(false)
          try { await video.play() } catch {}
        }
      },
      seek = (val: number) => {
        const video = getVideo()
        setCurrentTime(val)

        if (video)
          video.currentTime = val
      },
      seekRight = () => {
        const video = getVideo()
        if (!video) return

        seek(video.currentTime + 5)
      },
      seekLeft = () => {
        const video = getVideo()
        if (!video) return

        seek(video.currentTime - 5)
      },
      onMouseMove = () => {
        setControlsShown(true)
        setLastMouseMove(Date.now())
      },
      onTimeUpdate = () => {
        const video = getVideo()
        if (!video) return

        if (Date.now() > lastMouseMove + (3 * 1000))
          setControlsShown(false)

        setCurrentTime(video.currentTime)
      },
      onSeek = async (value: number) => {
        if (!controlsShown) return

        const video = getVideo()
        seek(value)

        if (video && !paused)
          try { await video.pause() } catch {}
      },
      afterSeek = async () => {
        const video = getVideo()

        if (video &&!paused)
          try { await video.play() } catch {}
      },
      onDoubleClick = () => {
        const container = containerRef?.current
        if (container)
          if (inFullScreen)
            fscreen.exitFullscreen()
          else fscreen.requestFullscreen(container)
      },
      onFullScreenChange = () => setInFullScreen(!inFullScreen),
      onKeyboardPress = (ev: any) => {
        const video = getVideo()
        if (!video) return

        switch (ev.code) {
          case 'ArrowLeft':
            seekLeft()
            break

          case 'ArrowRight':
            seekRight()
            break

          case 'Space':
            paused ? play() : pause()
            break

          default:
            process.env.NODE_ENV === 'development' ? ( null ) : ev.preventDefault()
            break
        }
      },
      onPressPlayBtn = () => {
        if (!controlsShown) return
        paused ? play() : pause()
      },
      onBackButton = () => {
        if (!controlsShown) return
        Router.back()
      },
      onPressSeekLeft = () => {
        if (!controlsShown) return
        seekLeft()
      },
      onPressSeekRight = () => {
        if (!controlsShown) return
        seekRight()
      },
      onClickFullScreen = () => {
        if (!controlsShown) return
        onDoubleClick()
      }

    useEffect(
      () => {
        const container = containerRef.current
        if (!container) return

        container.addEventListener('fullscreenchange', onFullScreenChange)
        return () => container.removeEventListener('fullscreenchange', onFullScreenChange)
      },
      [inFullScreen]
    )

    useEffect(
      () => {
        const video = getVideo()
        if (!video) return

        video.volume = volume
      },
      [volume]
    )

    useImperativeHandle(
      ref,
      () => {
        return {
          pause: () => {
            const video = getVideo()
            if (!video) return

            video.pause()
          },

          play: () => {
            const video = getVideo()
            if (!video) return

            video.play()
          }
        }
      }
    )

    return (
      <div
        onClick={
          () => {
            setControlsShown(true)
            setLastMouseMove(Date.now())
          }
        }
        onKeyDown={
          (ev) => onKeyboardPress(ev)
        }
        tabIndex={0}
        ref={containerRef as any}
        className='video-content'
        style={
          {
            backgroundColor: 'black',
            ...(
              props.autoFullScreen ? (
                {
                  width: '100vw',
                  height: '100vh'
                }
              ) : (
                {
                  width: props.width,
                  height: props.height
                }
              )
            )
          }
        }
        onMouseMove={onMouseMove}
      >
        { /* controls */ }
        <div
          style={
            {
              
              position: 'absolute',
              zIndex: '1',

              width: '100%',
              height: '100%',

              opacity: controlsShown ? 1 : 0,
              transition: 'ease-in-out .2s'
            }
          }
        >
          {
            props.noBackButton ? null : (
              <div
                style={
                  {
                    position: 'absolute',
                    fontSize: '32px',

                    padding: '10px',
                    cursor: 'pointer',

                    zIndex: '2'
                  }
                }
                onClick={onBackButton}
              >
                <ArrowLeftOutlined />
              </div>
            )
          }

          <div
            style={
              {
                position: 'absolute',
                display: 'flex',

                flexDirection: 'column',
                justifyContent: 'center',

                alignItems: 'center',
                width: '100%',
                
                marginTop: '5px'
              }
            }
          >
            <div
              style={
                {
                  fontWeight: 'bold',
                  fontSize: '20px',

                  textShadow: '2px 2px 3px #212121'
                }
              }
            >
              {props.title ?? ''}
            </div>

            <div
              style={
                {
                  fontSize: '14px',
                  color: '#858585'
                }
              }
            >
              {props.subtitle ?? ''}
            </div>
          </div>

          <div
            style={
              {
                display: 'flex',
                flexDirection: 'row',

                alignItems: 'center',
                justifyContent: 'center',

                height: '100%',
                flexWrap: 'wrap',

                fontSize: '32px',
                gap: '10px'
              }
            }
          >
            <div>
              <DoubleLeftOutlined onClick={onPressSeekLeft} />
            </div>

            <div style={{ fontSize: '64px' }}>
              {
                paused ? (
                  <CaretRightFilled onClick={onPressPlayBtn} />
                ) : <PauseOutlined onClick={onPressPlayBtn} />
              }
            </div>

            <div>
              <DoubleRightOutlined onClick={onPressSeekRight} />
            </div>
          </div>

          <div
            style={
              {             
                display: 'flex',
                flexDirection: 'row', 

                position: 'absolute',
                width: '100%',

                bottom: 0,
                gap: '10px',

                justifyContent: 'center',
                alignItems: 'center',

                padding: '0px 20px 0px'
              }
            }
          >
            <div
              style={
                {
                  display: 'flex',
                  flexDirection: 'row',

                  flexWrap: 'nowrap',
                  gap: '5px'
                }
              }
            >
              <div>
                {formatNum(currentTime)}
              </div>

              <div>/</div>

              <div>
                {formatNum(videoRef?.current?.duration)}
              </div>
            </div>

            <div
              style={
                {
                  display: 'flex',
                  flexDirection: 'row',

                  flexWrap: 'nowrap',
                  gap: '5px',

                  justifyContent: 'center',
                  alignItems: 'center'
                }
              }
            >
              <div style={{ fontSize: '24px' }}>
                <SoundOutlined/>
              </div>

              <div style={{ width: '80px' }}>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={volume}
                  onChange={(val) => setVolume(val)}
                  trackStyle={{ backgroundColor: '#4593ff' }}
                  handleStyle={{ backgroundColor: '#4593ff' }}
                />
              </div>

              
            </div>

            <div
              style={
                { width: '100%' }
              }
            >
              <Slider 
                min={0}
                max={videoRef.current?.duration}
                step={0.1}
                value={currentTime}
                onChange={onSeek}
                onAfterChange={afterSeek}
                trackStyle={
                  { backgroundColor: '#a13cff' }
                }
                handleStyle={
                  { backgroundColor: '#a13cff' }
                }
                tooltipPlacement='top'
                tipFormatter={
                  (val: number = 0) => {
                    const formatted = moment.utc(val * 1000)
                      .format('HH:mm:ss')

                    return (
                      <>
                        {formatted}
                      </>
                    )
                  }
                }
              />
            </div>

            <div
              style={
                {
                  fontSize: '32px',
                  display: 'flex',

                  flexDirection: 'row',
                  gap: '10px'
                }
              }
            >
              <div
                style={{ cursor: !!props.onPrevious ? 'pointer' : 'not-allowed' }}
              >
                <VerticalRightOutlined
                  onClick={props.onPrevious}
                />
              </div>

              <div
                style={{ cursor: !!props.onNext ? 'pointer' : 'not-allowed' }}
              >
                <VerticalLeftOutlined onClick={props.onNext} />
              </div>

              <div>
                {
                  inFullScreen ? (
                    <FullscreenExitOutlined onClick={onClickFullScreen} />
                  ) : <FullscreenOutlined onClick={onClickFullScreen} />
                }
              </div>
            </div>
          </div>

        </div>

        <video
          {...props.videoProps}

          src={props.src}
          style={
            {
              opacity: controlsShown ? .8 : 1,
              transition: 'ease-in-out .2s'
            }
          }

          autoPlay={props.autoPlay}
          className={
            props.autoFullScreen ? 
              `fullscreen-video ${props.videoProps?.className ?? ''}`.trim() :
              props.videoProps?.className
          }

          disablePictureInPicture={props.noPip}
          ref={videoRef as any}

          onTimeUpdate={onTimeUpdate}
          onEnded={
            () => {
              setPaused(true)
              seek(0)
            }
          }
          onPause={() => setPaused(true)}
          onPlay={() => setPaused(false)}

          onCanPlay={() => play()}
        >
          { /* todo add option for subtitles */ }
          <track
            default
            src={(props.subtitle ?? '') + '/english.vtt'}
            kind='captions'
            srcLang='en'
          />
        </video>
      </div>
    )
  }
)

export default Video 
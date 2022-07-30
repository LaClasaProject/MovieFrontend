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
  CopyrightOutlined,
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
      [paused, setPaused] = useState(true),
      [volume, setVolume] = useState(1),
      [isFullScreen, setIsFullScreen] = useState(false),
      [caption, setCaption] = useState(''),
      [captionsOn, setCaptionsOn] = useState(true),
      containerRef = useRef()

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
        const container = props.autoFullScreen ? document.body : containerRef.current
        if (!container) return

        setIsFullScreen(!isFullScreen)

        if (document.fullscreenElement)
          fscreen.exitFullscreen()
        else container.requestFullscreen({ navigationUI: 'hide' })
      },
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
        
        if (isFullScreen)
          fscreen.exitFullscreen()

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
      },
      textTrackRef = useRef<HTMLTrackElement>(),
      onCueChange = (ev: any) => {
        const elem = ev.target as HTMLTrackElement,
          cue = (elem.track?.activeCues ?? [])[0] as any

        setCaption(cue?.text ?? '')
      },
      onToggleCaptions = () => setCaptionsOn(!captionsOn)

    useEffect(
      () => {
        const video = getVideo()
        if (!video) return

        video.volume = volume
      },
      [volume]
    )

    useEffect(
      () => {
        if (document)
          setIsFullScreen(!!document.fullscreenElement)

        const track = textTrackRef.current
        if (!track) return

        track.addEventListener(
          'cuechange',
          onCueChange
        )

        return () => {
          track.removeEventListener('cuechange', onCueChange)
        }
      },
      []
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
        ref={containerRef as any}
        onKeyDown={
          (ev) => onKeyboardPress(ev)
        }
        tabIndex={0}
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
        {/* subtitle */}
        <div
          className='captions'
          style={
            { paddingBottom: controlsShown ? '100px' : '20px' }
          }
        >
          {
            captionsOn ? <pre>{caption}</pre> : null
          }
        </div>

        { /* controls */ }
        <div
          style={
            {
              
              position: 'absolute',
              zIndex: '1',

              width: '100%',
              height: '100%',

              transition: 'ease-in-out .2s',
              opacity: Number(controlsShown)
            }
          }
        >
          <div
            className='flex row top-controls w-100'
            style={{ position: 'absolute' }}
          >
            {
              props.noBackButton ? null : (
                <div>
                  <ArrowLeftOutlined
                    className='back-button'
                    onClick={onBackButton}
                  />
                </div>
              )
            }

            <div className='flex col center w-100'>
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
                    color: '#858585',

                    textShadow: '2px 2px 3px #212121'
                  }
                }
              >
                {props.subtitle ?? ''}
              </div>
            </div>
          </div>

          <div className='flex row center h-100 mid-controls'>
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

          <div className='absolute-bottom bottom-controls'>
            <div
              className='flex row center'
              style={{ paddingLeft: '5px', paddingRight: '5px' }}
            >
              <div className='w-100'>
                <Slider
                  min={0}
                  max={videoRef.current?.duration}
                  step={0.1}
                  value={currentTime}
                  onChange={onSeek}
                  onAfterChange={afterSeek}
                  trackStyle={{ backgroundColor: '#a13cff' }}
                  handleStyle={{ backgroundColor: '#a13cff' }}
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
                className='flex row'
                style={{ gap: '5px' }}
              >
                <div>
                  {formatNum(currentTime)}
                </div>

                <div>/</div>

                <div>
                  {formatNum(videoRef?.current?.duration)}
                </div>
              </div>
            </div>

            <div
              className='flex row center extra-controls wrap'
              style={{ gap: '15px' }}
            >
              <div className='flex row center'>
                <div>
                  <SoundOutlined style={{ cursor: 'pointer' }} />
                </div>
                <div>
                  <Slider
                    style={{ width: '80px' }}
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

              <div>
                <Tooltip title='Previous Episode'>
                  <VerticalRightOutlined
                    onClick={props.onPrevious}
                  />
                </Tooltip>
              </div>

              <div>
                <Tooltip title='Next Episode'>
                  <VerticalLeftOutlined
                    onClick={props.onNext}
                  />
                </Tooltip>
              </div>
              
              <div>
                {
                  isFullScreen ? (
                    <FullscreenExitOutlined onClick={onClickFullScreen} />
                  ) : (
                    <FullscreenOutlined onClick={onClickFullScreen} />
                  )
                }
              </div>

              <div
                className='flex row center'
                style={{ gap: '5px', cursor: 'pointer' }}
                onClick={onToggleCaptions}
              >
                <div>
                  <CopyrightOutlined />
                </div>

                <div
                  style={{ fontSize: '14px', }}
                >
                  {captionsOn ? (
                    <s>Captions</s>
                  ) : 'Captions'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <video
          {...props.videoProps}

          style={
            {
              transition: 'ease-in-out .2s',
              opacity: controlsShown ? .7 : 1
            }
          }
          src={props.src}

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
          crossOrigin='anonymous'
        >
          { /* todo add option for subtitles */ }
          <track
            ref={textTrackRef as any}
            default
            src={(props.captions ?? '') + '/english.vtt'}
            kind='captions'
            srcLang='en'
          />
        </video>
      </div>
    )
  }
)

export default Video 
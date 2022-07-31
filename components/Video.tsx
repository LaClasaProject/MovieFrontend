import { ICustomVideoProps } from '../src/types'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'

import fscreen from '../src/fscreen'
import {
  ArrowLeftOutlined,
  CaretRightFilled,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  PauseOutlined
} from '@ant-design/icons'

import Router from 'next/router'

// control elements
import VolumeButton from './controls/Volume'
import FullScreenButton from './controls/FullScreen'
import CaptionsButton from './controls/Captions'
import EpisodeSwitcherButton from './controls/EpisodeSwitcher'
import VideoSlider from './controls/VideoSlider'
import VideoTime from './controls/VideoTime'

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
      containerRef = useRef<HTMLDivElement>()

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
        else fscreen.requestFullscreen(container)
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
      onToggleCaptions = () => setCaptionsOn(!captionsOn),
      toolTipPopupContainer = () => props.autoFullScreen ? document.body : containerRef.current as HTMLDivElement

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
        if (props.autoFullScreen)
          setIsFullScreen(!!document.fullscreenElement)
        else setIsFullScreen(!!isFullScreen)

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
              style={
                {
                  paddingLeft: '10px',
                  paddingRight: '10px',

                  gap: '10px',
                  fontSize: '20px',

                  marginTop: '5px',
                  marginBottom: '5px'
                }
              }
            >
              {
                props.minimalControls ? (
                  <>
                    <FullScreenButton
                      isFullScreen={isFullScreen}
                      onChange={onClickFullScreen}
                    />
                    <VolumeButton
                      onChangeVolume={setVolume}
                      toolTipContainer={toolTipPopupContainer}
                      volume={volume}
                    />
                  </>
                ) : null
              }

              <VideoSlider
                max={videoRef.current?.duration ?? 0}
                onSeek={onSeek}
                onDoneSeek={afterSeek}
                toolTipContainer={toolTipPopupContainer}
                value={currentTime}
              />

              <VideoTime
                current={currentTime}
                max={videoRef.current?.duration ?? 0}
              />
            </div>

            {
              props.minimalControls ? null : (
                <div
                  className='flex row center extra-controls wrap'
                  style={{ gap: '15px' }}
                >
                  <VolumeButton
                    onChangeVolume={setVolume}
                    toolTipContainer={toolTipPopupContainer}
                    volume={volume}
                  />
                  <EpisodeSwitcherButton
                    toolTipContainer={toolTipPopupContainer}
                    onPrevious={props.onPrevious}
                    onNext={props.onNext}
                  />
                  <FullScreenButton
                    isFullScreen={isFullScreen}
                    onChange={onClickFullScreen}
                  />
                  <CaptionsButton
                    on={captionsOn}
                    onChange={onToggleCaptions}
                  />
                </div>
              )
            }
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
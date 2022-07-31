import { Slider } from 'antd'
import moment from 'moment'

interface VideoSliderProps {
  max: number
  value: number

  onSeek: (value: number) => void
  onDoneSeek: (value: number) => void

  toolTipContainer?: () => HTMLElement
}

const VideoSlider = (props: VideoSliderProps) => (
  <div className='w-100'>
    <Slider
      min={0}
      max={props.max}
      step={0.1}
      value={props.value}
      onChange={props.onSeek}
      onAfterChange={props.onDoneSeek}
      trackStyle={{ backgroundColor: '#a13cff' }}
      handleStyle={{ backgroundColor: '#a13cff' }}
      tooltipPlacement='top'
      getTooltipPopupContainer={props.toolTipContainer}
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
)

export default VideoSlider
import { Tooltip, Slider } from 'antd' 
import { SoundOutlined } from '@ant-design/icons'

interface VolumeButtonProps {
  onChangeVolume: (volume: number) => void
  toolTipContainer?: () => HTMLElement

  volume: number
}

const VolumeButton = (props: VolumeButtonProps) => (
  <div>
    <Tooltip
      trigger={['hover', 'click']}
      getTooltipContainer={props.toolTipContainer}
      title={
        (
          <Slider
            style={{ height: '80px' }}
            min={0}
            max={1}
            step={0.1}
            value={props.volume}
            onChange={props.onChangeVolume}
            vertical
            trackStyle={{ backgroundColor: '#4593ff' }}
            handleStyle={{ backgroundColor: '#4593ff' }}
            getTooltipPopupContainer={props.toolTipContainer}
          />
        )
      }
    >
      <SoundOutlined style={{ cursor: 'pointer' }} />
    </Tooltip>
  </div>
)

export default VolumeButton
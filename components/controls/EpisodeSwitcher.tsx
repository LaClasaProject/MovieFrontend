import { Tooltip } from 'antd'
import {
  VerticalRightOutlined,
  VerticalLeftOutlined
} from '@ant-design/icons'

interface EpisodeSwitcherButtonProps {
  onPrevious?: () => void
  onNext?: () => void

  toolTipContainer?: () => HTMLElement
}

const EpisodeSwitcherButton = (props: EpisodeSwitcherButtonProps) => (
  <>
    <div>
      <Tooltip
        title='Previous Episode'
        getPopupContainer={props.toolTipContainer}
      >
        <VerticalRightOutlined
          onClick={props.onPrevious}
        />
      </Tooltip>
    </div>

    <div>
      <Tooltip
        title='Next Episode'
        getPopupContainer={props.toolTipContainer}
      >
        <VerticalLeftOutlined
          onClick={props.onNext}
        />
      </Tooltip>
    </div>
  </>
)

export default EpisodeSwitcherButton
import { Tooltip } from 'antd'
import { CopyrightOutlined } from '@ant-design/icons'

interface CaptionsButtonProps {
  on?: boolean
  onChange: () => void

  toolTipContainer?: () => HTMLElement
}

const CaptionsButton = (props: CaptionsButtonProps) => (
  <div>
    <Tooltip
      trigger={['hover', 'click']}
      getPopupContainer={props.toolTipContainer}
      title={`Captions ${props.on ? 'On' : 'Off'}`}
    >
      <CopyrightOutlined
        onClick={props.onChange}
      />
    </Tooltip>
  </div>
)

export default CaptionsButton
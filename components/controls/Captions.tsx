import { Tooltip } from 'antd'
import { CopyrightOutlined } from '@ant-design/icons'

interface CaptionsButtonProps {
  on?: boolean
  onChange: () => void
}

const CaptionsButton = (props: CaptionsButtonProps) => (
  <div>
    <Tooltip
      title={`Captions ${props.on ? 'On' : 'Off'}`}
    >
      <CopyrightOutlined
        onClick={props.onChange}
      />
    </Tooltip>
  </div>
)

export default CaptionsButton
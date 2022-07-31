import { Tooltip } from 'antd'
import {
  RadiusBottomleftOutlined,
  RadiusUprightOutlined
} from '@ant-design/icons'

interface FitButtonProps {
  mode: 'contain' | 'fill'
  onToggleFit: () => void

  toolTipContainer?: () => HTMLElement
}

const FitButton = (props: FitButtonProps) => (
  <div>
    <Tooltip
      trigger={['click', 'hover']}
      getPopupContainer={props.toolTipContainer}
      title={
        props.mode === 'contain' ? 
          'Set to Fill' :
          'Set to Contain'
      }
    >
      {
        props.mode === 'contain' ? (
          <RadiusUprightOutlined onClick={props.onToggleFit} />
        ) : <RadiusBottomleftOutlined onClick={props.onToggleFit} />
      }
    </Tooltip>
  </div>
)

export default FitButton
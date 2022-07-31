import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons'

interface FullScreenButtonProps {
  isFullScreen: boolean
  onChange: () => void
}

const FullScreenButton = (props: FullScreenButtonProps) => (
  <div>
    {
      props.isFullScreen ? (
        <FullscreenExitOutlined onClick={props.onChange} />
      ) : (
        <FullscreenOutlined onClick={props.onChange} />
      )
    }
  </div>
)

export default FullScreenButton
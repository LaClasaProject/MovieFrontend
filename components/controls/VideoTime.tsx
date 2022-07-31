import moment from 'moment'

interface VideoTimeProps {
  current: number
  max: number
}

const formatNum = (value: number = 0) =>
  moment.utc(
    (value || 0) * 1000
    )
    .format('HH:mm:ss') 

const VideoTime = (props: VideoTimeProps) => (
  <div
    className='flex row'
    style={{ gap: '5px', fontSize: '14px' }}
  >
    <div>
      {formatNum(props.current)}
    </div>

    <div>/</div>

    <div>
      {formatNum(props.max)}
    </div>
  </div>
)

export default VideoTime
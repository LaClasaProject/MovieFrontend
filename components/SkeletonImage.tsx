import { useState } from 'react'
import { Skeleton } from 'antd'

import { SkeletonImageProps } from 'antd/lib/skeleton/Image'

const SkeletonImage = (
  props: SkeletonImageProps & JSX.IntrinsicElements['img']
) => {
  const [imgHasLoaded, setImgHasLoaded] = useState(false)

  return (
    <div
      style={
        {
          position: 'relative'
        }
      }
    >

      <div
        hidden={imgHasLoaded}
        style={
          {
            position: 'absolute'
          }
        }
      >
        <Skeleton.Image
          style={
            {
              width: props.width as any,
              height: props.height as any
            }
          }
        />
      </div>

      {
        !props.src ? null : (
          <img
            {...props}
            src={props.src ?? ''}
            width={props.width}
            height={props.height}
            alt=''
            onLoad={
              () => {
                console.log('hii')
                setImgHasLoaded(true)
              }
            }
            onError={
              () => setImgHasLoaded(true)
            }
          />
        )
      }
    </div>
  )
}

export default SkeletonImage
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

import { Skeleton } from 'antd'

interface SkeletonImageProps extends ImageProps {
  src: any
}

const SkeletonImage = (
  props: SkeletonImageProps
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
            position: 'absolute',
            zIndex: '2'
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
          <Image
            {...props}
            onLoad={
              () => setImgHasLoaded(true)
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
import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

import { Skeleton } from 'primereact/skeleton'

interface SkeletonImageProps extends ImageProps {
  src: any
}

const SkeletonImage = (
  props: SkeletonImageProps
) => {
  const [imgHasLoaded, setImgHasLoaded] = useState(true)

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
        <Skeleton
          width={props.width as any}
          height={props.height as any}
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
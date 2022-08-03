import { CaretRightFilled, WechatFilled } from '@ant-design/icons'
import Button from '../components/Button'

import Link from 'next/link'

const HomePage = () => (
  <div
    style={
      {
        textAlign: 'center',
        display: 'flex',

        flexDirection: 'column',
        flexWrap: 'wrap',

        justifyContent: 'center',
        alignItems: 'center'
      }
    }
  >

    <div
      style={
        {
          fontFamily: 'Bebas Neue',
          fontSize: '64px'
        }
      }
    >
      Hello User!
    </div>

    <div
      className='flex col'
      style={
        {
          fontFamily: 'Lato',
          fontSize: '18px',

          maxWidth: '320px',
          gap: '20px'
        }
      }
    >
      <div>
        This part of the website, which includes the login page is still under maintenance.
        You can watch shows and movies on the button below.
      </div>     

      <Button
        color='green'
        className='flex row center'
        style={{ gap: '5px' }}
        onClick={() => window.location.href = '/watch'}
      >
        Watch Movies

        <CaretRightFilled />
      </Button>

      <Button
        color='cyan'
        className='flex row center'
        style={{ gap: '5px' }}
        onClick={() => window.location.href = process.env.DISCORD_INV ?? ''}
      >
        Join Our Discord

        <WechatFilled />
      </Button>
    </div>

  </div>
)

export default HomePage
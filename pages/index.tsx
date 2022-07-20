import { Button } from 'antd'
import Router from 'next/router'

import { ArrowRightOutlined } from '@ant-design/icons'

const IndexPage = () => (
  <div 
    className='flex col wrap'
    style={
      {
        justifyContent: 'center',
        alignItems: 'center',

        marginTop: '32px',
        marginBottom: '32px',

        gap: '20px'
      }
    }
  >
    <div
      className='flex col wrap'
      style={
        {
          maxWidth:' 480px'
        }
      }
    >
      <div
        className='header'
        style={
          {
            fontSize: '40px',
            fontWeight: 'bold'
          }
        }
      >
        {process.env.SITE_TITLE}
      </div>

      <div
        style={
          {
            color: '#DDDDDD',
            fontSize: '16px'
          }
        }
      >
        {process.env.SITE_DESCRIPTION}
      </div>
    </div>

    <div>
      <Button
        type='primary'
        size='large'
        onClick={
          () => {
            Router.push('/videos')
          }
        }
        icon={
          <ArrowRightOutlined />
        }
      >
        View Movies
      </Button>
    </div>
  </div>
)

export default IndexPage
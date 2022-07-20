import { Button } from 'antd'

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
    <div className='flex col wrap'>
      <div
        className='header'
        style={
          {
            fontSize: '28px'
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
      >
        View Movies
      </Button>
    </div>
  </div>
)

export default IndexPage
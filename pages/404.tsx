import { Result } from 'antd'

const Page404 = () => (
  <div className='flex col wrap'>
    <div>
      <Result
        status="404"
        title="404"
        subTitle="Sorry this page doesn't exist."
      />
    </div>
  </div>
)

export default Page404
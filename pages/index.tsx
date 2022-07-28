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
      style={
        {
          fontFamily: 'Lato',
          fontSize: '18px',

          maxWidth: '340px'
        }
      }
    >
      This part of the website, which includes the login page is still under maintenance.
      You can watch shows and movies on this

      <a href='/watch'> link</a>:
    </div>

  </div>
)

export default HomePage
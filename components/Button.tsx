import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useRef,
  useState
} from 'react'

interface ButtonProps  {
  color?: string
  disabled?: boolean

  icon?: JSX.Element
  centered?: boolean

  filled?: boolean
}

interface IColors {
  [key: string]: {
    main: string
    text: string

    alwaysTextColor?: boolean
  }
}

const colors: IColors  = {
    red: {
      main: '#ff7a7a',
      text: 'white'
    },

    purple: {
      main: '#bb87ff',
      text: 'white'
    },

    green: {
      main: '#89da83',
      text: 'white'
    },

    cyan: {
      main: '#73eaff',
      text: 'white'
    },

    blue: {
      main: '#75afff',
      text: 'white'
    },

    blurple: {
      main: '#5865F2',
      text: 'white'
    },

    default: {
      main: '#2c2c2c',
      text: 'white',

      alwaysTextColor: true
    }
  },
  buttonStyle = (
    { color, filled, shadow }: {
      color?: string
      filled?: boolean
      shadow?: boolean
    }
  ) => {
    const palette = colors[color || 'default'] || colors.default

    return {
      padding: '10px 30px 10px 30px',
      outline: 'none',
      
      border: `2px solid ${palette.main}`,
      borderRadius: '30px',
      
      fontSize: '20px',
      cursor: 'pointer',
      
      transition: 'ease-in-out .2s',
      backgroundColor: filled ? palette.main : 'transparent',

      color: filled ? (
          palette.text
        ) : (
          palette.alwaysTextColor ? palette.text : palette.main
        ),

      boxShadow: shadow ? (
        `2px 2px 15px ${palette.main}`
      ) : 'none'
    }
  }

const Button = (
  props: ButtonProps & DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
) => {
  const [style, setStyle] = useState(
    buttonStyle(
      { color: props.color, filled: props.filled }
    )
  )

  return (
    <button
      onMouseEnter={
        () => {
          if (props.filled) return
          setStyle(
            buttonStyle(
              { color: props.color, filled: true, shadow: true }
            )
          )
        }
      }
      onMouseLeave={
        () => {
          if (props.filled) return
          setStyle(
            buttonStyle(
              { color: props.color }
            )
          )
        }
      }

      {...props}
      style={
        {
          ...(props.style),
          ...style,

          display: 'flex',
          flexDirection: 'row',

          flexWrap: 'wrap',
          gap: '10px',

          ...(
            props.centered ? (
              {
                justifyContent: 'center',
                alignItems: 'center',

                textAlign: 'center'
              }
            ) : {}
          )
        }
      }

      className={`btn ${props.className ?? ''}`}
    >
      <div>
        {props.children}
      </div>

      {
        props.icon ? (
          <div>
            {props.icon}
          </div>
        ) : null
      }
    </button>
  )
}

export default Button
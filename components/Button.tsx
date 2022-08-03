import {
  ButtonHTMLAttributes,
  DetailedHTMLProps
} from 'react'

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  color?: string
  disabled?: boolean

  icon?: JSX.Element
  textCentered?: boolean
}

const Button = (
  props: ButtonProps
) => (
  <button
    {...props}
    className={`btn ${props?.color ?? ''} ${props.className}`}
    style={
      {
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? '.7' : undefined,

        ...props.style,

        display: 'flex',
        flexDirection: 'row',

        flexWrap: 'wrap',
        gap: '10px',

        ...(
          props.textCentered ? (
            {
              justifyContent: 'center',
              alignItems: 'center'
            }
          ) : {}
        )
      }
    }
  >
    <div>
      {props.children}
    </div>

    <div>
      {props.icon ?? null}
    </div>
  </button>
)

export default Button
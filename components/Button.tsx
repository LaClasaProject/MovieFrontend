import {
  ButtonHTMLAttributes,
  DetailedHTMLProps
} from 'react'

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  color?: string
  disabled?: boolean
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
        ...props.style
      }
    }
  />
)

export default Button
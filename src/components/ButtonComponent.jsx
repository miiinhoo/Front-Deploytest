

const ButtonComponent = ({cln , onClick, text, type, style}) => {
  
  return(
      <button type={type}
      onClick={onClick}
      className={cln}
      style={style}
      >
        {text}
      </button>

  )
}
export default ButtonComponent;